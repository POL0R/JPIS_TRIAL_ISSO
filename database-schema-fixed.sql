-- ISSO Scoreboard Database Schema (Fixed - handles existing types/tables)
-- Run this in your Supabase SQL editor

-- Note: RLS is enabled by default in Supabase

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE sport_kind AS ENUM ('FOOTBALL', 'BASKETBALL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('Boys', 'Girls', 'None');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE match_stage AS ENUM ('Group', 'Quarterfinal', 'Semifinal', 'Final');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE match_status AS ENUM ('Upcoming', 'Live', 'Final');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('Viewer', 'Scorer', 'Admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Sports table
CREATE TABLE IF NOT EXISTS sports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kind sport_kind NOT NULL,
  division VARCHAR(10) NOT NULL,
  gender gender_type NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  short_code VARCHAR(10) NOT NULL,
  group_name VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sport_id, short_code)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
  stage match_stage NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  venue VARCHAR(200) NOT NULL,
  status match_status DEFAULT 'Upcoming',
  home_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  home_score INTEGER DEFAULT 0 CHECK (home_score >= 0),
  away_score INTEGER DEFAULT 0 CHECK (away_score >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Football goals table (only for football matches)
CREATE TABLE IF NOT EXISTS football_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  player_name VARCHAR(100) NOT NULL,
  minute INTEGER NOT NULL CHECK (minute >= 0 AND minute <= 120),
  own_goal BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role user_role DEFAULT 'Viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table (for scorer permissions)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_teams_sport_id ON teams(sport_id);
CREATE INDEX IF NOT EXISTS idx_matches_sport_id ON matches(sport_id);
CREATE INDEX IF NOT EXISTS idx_matches_starts_at ON matches(starts_at);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_home_team ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team ON matches(away_team_id);
CREATE INDEX IF NOT EXISTS idx_football_goals_match_id ON football_goals(match_id);
CREATE INDEX IF NOT EXISTS idx_football_goals_team_id ON football_goals(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- Create view for top scorers (drop and recreate to handle changes)
DROP VIEW IF EXISTS football_top_scorers;
CREATE VIEW football_top_scorers AS
SELECT 
  fg.player_name,
  t.name as team_name,
  t.short_code as team_short_code,
  COUNT(*) as goals
FROM football_goals fg
JOIN teams t ON fg.team_id = t.id
WHERE fg.own_goal = FALSE
GROUP BY fg.player_name, t.name, t.short_code
ORDER BY goals DESC, fg.player_name ASC;

-- RLS Policies

-- Enable RLS on all tables
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE football_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Sports are publicly readable" ON sports;
DROP POLICY IF EXISTS "Teams are publicly readable" ON teams;
DROP POLICY IF EXISTS "Matches are publicly readable" ON matches;
DROP POLICY IF EXISTS "Football goals are publicly readable" ON football_goals;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own team memberships" ON team_members;
DROP POLICY IF EXISTS "Users can create team membership requests" ON team_members;

-- Sports: Public read access
CREATE POLICY "Sports are publicly readable" ON sports
  FOR SELECT USING (true);

-- Teams: Public read access
CREATE POLICY "Teams are publicly readable" ON teams
  FOR SELECT USING (true);

-- Matches: Public read access
CREATE POLICY "Matches are publicly readable" ON matches
  FOR SELECT USING (true);

-- Football goals: Public read access
CREATE POLICY "Football goals are publicly readable" ON football_goals
  FOR SELECT USING (true);

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Team members: Users can create requests, admins can approve
CREATE POLICY "Users can view own team memberships" ON team_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create team membership requests" ON team_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies (will be created after RPC functions)
-- These will be handled by RPC functions for security

-- RPC Functions

-- Function to check if user can edit a match
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
  -- Get user's role
  SELECT role INTO user_role
  FROM profiles
  WHERE user_id = auth.uid();
  
  -- If user is admin, they can edit any match
  IF user_role = 'Admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Get match details
  SELECT * INTO match_record
  FROM matches
  WHERE id = match_id;
  
  -- If match is final, only admins can edit
  IF match_record.status = 'Final' THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user is approved scorer for home or away team
  SELECT EXISTS(
    SELECT 1 FROM team_members tm
    WHERE tm.user_id = auth.uid()
    AND tm.approved = TRUE
    AND (tm.team_id = match_record.home_team_id OR tm.team_id = match_record.away_team_id)
  ) INTO is_team_member;
  
  RETURN is_team_member;
END;
$$;

-- Function to set basketball score
CREATE OR REPLACE FUNCTION set_basketball_score(
  match_id UUID,
  home_score INTEGER,
  away_score INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Check permissions
  IF NOT user_can_edit_match(match_id) THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient permissions');
  END IF;
  
  -- Validate scores
  IF home_score < 0 OR away_score < 0 THEN
    RETURN json_build_object('success', false, 'message', 'Scores must be non-negative');
  END IF;
  
  -- Update match
  UPDATE matches
  SET 
    home_score = home_score,
    away_score = away_score,
    status = CASE 
      WHEN status = 'Upcoming' THEN 'Live'::match_status
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = match_id;
  
  RETURN json_build_object('success', true, 'message', 'Score updated successfully');
END;
$$;

-- Function to add football goal
CREATE OR REPLACE FUNCTION add_football_goal(
  match_id UUID,
  team_id UUID,
  player_name TEXT,
  minute INTEGER,
  own_goal BOOLEAN DEFAULT FALSE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  match_record RECORD;
  home_score INTEGER;
  away_score INTEGER;
BEGIN
  -- Check permissions
  IF NOT user_can_edit_match(match_id) THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient permissions');
  END IF;
  
  -- Get match details
  SELECT * INTO match_record
  FROM matches
  WHERE id = match_id;
  
  -- Validate minute
  IF minute < 0 OR minute > 120 THEN
    RETURN json_build_object('success', false, 'message', 'Minute must be between 0 and 120');
  END IF;
  
  -- Insert goal
  INSERT INTO football_goals (match_id, team_id, player_name, minute, own_goal, created_by)
  VALUES (match_id, team_id, player_name, minute, own_goal, auth.uid());
  
  -- Recalculate scores
  SELECT 
    COUNT(CASE WHEN fg.team_id = match_record.home_team_id AND fg.own_goal = FALSE THEN 1 END) +
    COUNT(CASE WHEN fg.team_id = match_record.away_team_id AND fg.own_goal = TRUE THEN 1 END),
    COUNT(CASE WHEN fg.team_id = match_record.away_team_id AND fg.own_goal = FALSE THEN 1 END) +
    COUNT(CASE WHEN fg.team_id = match_record.home_team_id AND fg.own_goal = TRUE THEN 1 END)
  INTO home_score, away_score
  FROM football_goals fg
  WHERE fg.match_id = match_id;
  
  -- Update match scores and status
  UPDATE matches
  SET 
    home_score = home_score,
    away_score = away_score,
    status = CASE 
      WHEN status = 'Upcoming' THEN 'Live'::match_status
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = match_id;
  
  RETURN json_build_object('success', true, 'message', 'Goal added successfully');
END;
$$;

-- Function to finalize match
CREATE OR REPLACE FUNCTION finalize_match(match_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if user is admin
  SELECT role INTO user_role
  FROM profiles
  WHERE user_id = auth.uid();
  
  IF user_role != 'Admin' THEN
    RETURN json_build_object('success', false, 'message', 'Only admins can finalize matches');
  END IF;
  
  -- Update match status
  UPDATE matches
  SET 
    status = 'Final'::match_status,
    updated_at = NOW()
  WHERE id = match_id;
  
  RETURN json_build_object('success', true, 'message', 'Match finalized successfully');
END;
$$;

-- Insert initial data (only if not exists)
INSERT INTO sports (kind, division, gender, slug, name) VALUES
('FOOTBALL', 'U19', 'None', 'football-u19', 'U19 Football'),
('BASKETBALL', 'U17', 'Boys', 'basketball-u17-boys', 'U17 Boys Basketball'),
('BASKETBALL', 'U17', 'Girls', 'basketball-u17-girls', 'U17 Girls Basketball')
ON CONFLICT (slug) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers (drop and recreate to handle changes)
DROP TRIGGER IF EXISTS update_sports_updated_at ON sports;
CREATE TRIGGER update_sports_updated_at BEFORE UPDATE ON sports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
