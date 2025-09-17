-- SQL Import Template for Matches
-- Replace the values below with your actual data

-- First, insert teams (if not already inserted)
INSERT INTO teams (sport_id, name, short_code, group_name) VALUES
-- Get the sport ID first
((SELECT id FROM sports WHERE slug = 'football-u19'), 'JPIS', 'JPIS', 'A'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Team B', 'TB', 'A'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Team C', 'TC', 'B'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Team D', 'TD', 'B')
ON CONFLICT (sport_id, short_code) DO NOTHING;

-- Then insert matches
INSERT INTO matches (sport_id, stage, starts_at, venue, home_team_id, away_team_id, home_score, away_score) VALUES
-- Football U19 Matches
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-19T10:00:00Z', 'Main Field', 
 (SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'TB' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-19T12:00:00Z', 'Field 2',
 (SELECT id FROM teams WHERE short_code = 'TC' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'TD' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-20T10:00:00Z', 'Main Field',
 (SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'TC' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-20T12:00:00Z', 'Field 2',
 (SELECT id FROM teams WHERE short_code = 'TB' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'TD' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0);

-- Add more matches as needed...
