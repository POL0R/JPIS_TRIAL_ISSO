-- Hotfix: simplify permissions so any signed-in user can edit scores
-- Run this in Supabase SQL Editor

-- 1) Loosen permission helper to allow edits when no profile row exists
CREATE OR REPLACE FUNCTION user_can_edit_match(match_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
  match_record RECORD;
  is_team_member BOOLEAN;
BEGIN
  -- Get user's role (may be NULL if no profile row exists)
  SELECT role INTO user_role
  FROM profiles
  WHERE user_id = auth.uid();

  -- Treat missing profile as allowed (simplified model: any authenticated user is admin)
  IF user_role IS NULL THEN
    RETURN TRUE;
  END IF;

  -- Admins can edit any match
  IF user_role = 'Admin' THEN
    RETURN TRUE;
  END IF;

  -- Fetch match
  SELECT * INTO match_record
  FROM matches
  WHERE id = match_id;

  -- Block if already final (only admins may change finals)
  IF match_record.status = 'Final' THEN
    RETURN FALSE;
  END IF;

  -- Scorers (approved team members) can edit their teams' matches
  SELECT EXISTS(
    SELECT 1 FROM team_members tm
    WHERE tm.user_id = auth.uid()
      AND tm.approved = TRUE
      AND (tm.team_id = match_record.home_team_id OR tm.team_id = match_record.away_team_id)
  ) INTO is_team_member;

  RETURN is_team_member;
END;
$$;

-- 2) Add RLS policy to allow updates when helper says so (and to any signed-in user as fallback)
DROP POLICY IF EXISTS "Allow updates when user_can_edit_match" ON matches;
CREATE POLICY "Allow updates when user_can_edit_match" ON matches
  FOR UPDATE
  USING (
    user_can_edit_match(id) OR auth.role() = 'authenticated'
  )
  WITH CHECK (true);

-- 3) Ensure selecting profiles works for the helper
-- (Already allowed: "Users can view own profile")

-- 4) Optional: allow finalize via RPC by admins or any authenticated (simplified)
DROP POLICY IF EXISTS "Allow finalize by authenticated" ON matches;
CREATE POLICY "Allow finalize by authenticated" ON matches
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (true);

-- 6) Team players table to remember scorers per team
CREATE TABLE IF NOT EXISTS team_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  jersey_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, name)
);

ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;

-- allow public read (viewer)
DROP POLICY IF EXISTS "Team players readable" ON team_players;
CREATE POLICY "Team players readable" ON team_players
  FOR SELECT USING (true);

-- allow authenticated write
DROP POLICY IF EXISTS "Team players upsert by authenticated" ON team_players;
CREATE POLICY "Team players upsert by authenticated" ON team_players
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Team players update by authenticated" ON team_players;
CREATE POLICY "Team players update by authenticated" ON team_players
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (true);

-- 7) Basketball awards: record the highest scorer per basketball match
CREATE TABLE IF NOT EXISTS basketball_awards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE UNIQUE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL,
  jersey_number INTEGER,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE basketball_awards ENABLE ROW LEVEL SECURITY;

-- public can read
DROP POLICY IF EXISTS "Basketball awards readable" ON basketball_awards;
CREATE POLICY "Basketball awards readable" ON basketball_awards
  FOR SELECT USING (true);

-- authenticated can insert/update (one row per match enforced by UNIQUE)
DROP POLICY IF EXISTS "Basketball awards insert by authenticated" ON basketball_awards;
CREATE POLICY "Basketball awards insert by authenticated" ON basketball_awards
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Basketball awards update by authenticated" ON basketball_awards;
CREATE POLICY "Basketball awards update by authenticated" ON basketball_awards
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (true);

-- 5) Fix RPCs to avoid column/variable name shadowing so updates actually persist
-- Ensure old versions are removed before redefining with new parameter names
DROP FUNCTION IF EXISTS set_basketball_score(uuid, integer, integer);

CREATE OR REPLACE FUNCTION set_basketball_score(
  p_match_id UUID,
  p_home_score INTEGER,
  p_away_score INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT user_can_edit_match(p_match_id) THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient permissions');
  END IF;

  IF p_home_score < 0 OR p_away_score < 0 THEN
    RETURN json_build_object('success', false, 'message', 'Scores must be non-negative');
  END IF;

  UPDATE matches m
  SET 
    home_score = p_home_score,
    away_score = p_away_score,
    status = CASE 
      WHEN m.status = 'Upcoming' THEN 'Live'::match_status
      ELSE m.status
    END,
    updated_at = NOW()
  WHERE m.id = p_match_id;

  RETURN json_build_object('success', true, 'message', 'Score updated successfully');
END;
$$;

-- Ensure old versions are removed before redefining with new parameter names
DROP FUNCTION IF EXISTS add_football_goal(uuid, uuid, text, integer, boolean);

CREATE OR REPLACE FUNCTION add_football_goal(
  p_match_id UUID,
  p_team_id UUID,
  p_player_name TEXT,
  p_minute INTEGER,
  p_own_goal BOOLEAN DEFAULT FALSE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  match_record RECORD;
  new_home_score INTEGER;
  new_away_score INTEGER;
BEGIN
  IF NOT user_can_edit_match(p_match_id) THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient permissions');
  END IF;

  SELECT * INTO match_record
  FROM matches
  WHERE id = p_match_id;

  IF p_minute < 0 OR p_minute > 120 THEN
    RETURN json_build_object('success', false, 'message', 'Minute must be between 0 and 120');
  END IF;

  INSERT INTO football_goals (match_id, team_id, player_name, minute, own_goal, created_by)
  VALUES (p_match_id, p_team_id, p_player_name, p_minute, p_own_goal, auth.uid());

  SELECT 
    COUNT(CASE WHEN fg.team_id = match_record.home_team_id AND fg.own_goal = FALSE THEN 1 END) +
    COUNT(CASE WHEN fg.team_id = match_record.away_team_id AND fg.own_goal = TRUE THEN 1 END),
    COUNT(CASE WHEN fg.team_id = match_record.away_team_id AND fg.own_goal = FALSE THEN 1 END) +
    COUNT(CASE WHEN fg.team_id = match_record.home_team_id AND fg.own_goal = TRUE THEN 1 END)
  INTO new_home_score, new_away_score
  FROM football_goals fg
  WHERE fg.match_id = p_match_id;

  UPDATE matches m
  SET 
    home_score = COALESCE(new_home_score, 0),
    away_score = COALESCE(new_away_score, 0),
    status = CASE 
      WHEN m.status = 'Upcoming' THEN 'Live'::match_status
      ELSE m.status
    END,
    updated_at = NOW()
  WHERE m.id = p_match_id;

  RETURN json_build_object('success', true, 'message', 'Goal added successfully');
END;
$$;


