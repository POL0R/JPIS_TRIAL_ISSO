-- U19 Boys Football Data
-- Run this in your Supabase SQL Editor after running the main schema

-- First, insert teams for Football U19
INSERT INTO teams (sport_id, name, short_code, group_name) VALUES
((SELECT id FROM sports WHERE slug = 'football-u19'), 'JPIS', 'JPIS', 'A'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Oakridge', 'OAK', 'A'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Inventure Academy', 'INV', 'A'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Aditya Birla', 'AB', 'B'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Fountainhead', 'FH', 'B'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Indus - Hyderabad', 'IH', 'B'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Heritage', 'HER', 'C'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'B.D. Somani', 'BDS', 'C'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'HLC', 'HLC', 'C'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Indus - Pune', 'IP', 'D'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Dhirubhai Ambani', 'DA', 'D'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Sreenidhi', 'SRE', 'D'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Kings College India', 'KCI', 'D'),
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Pathways World', 'PW', 'D')
ON CONFLICT (sport_id, short_code) DO NOTHING;

-- Insert matches for Football U19
INSERT INTO matches (sport_id, stage, starts_at, venue, home_team_id, away_team_id, home_score, away_score) VALUES
-- September 18, 2025 - Morning Session
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-18T10:00:00Z', 'Main Field',
 (SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'OAK' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-18T10:00:00Z', 'Field 2',
 (SELECT id FROM teams WHERE short_code = 'AB' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'FH' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-18T10:00:00Z', 'Field 3',
 (SELECT id FROM teams WHERE short_code = 'HER' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'BDS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-18T10:00:00Z', 'Field 4',
 (SELECT id FROM teams WHERE short_code = 'IP' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'DA' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

-- September 18, 2025 - Morning Session (continued)
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-18T10:30:00Z', 'Main Field',
 (SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'INV' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-18T10:30:00Z', 'Field 2',
 (SELECT id FROM teams WHERE short_code = 'AB' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'IH' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-18T10:30:00Z', 'Field 3',
 (SELECT id FROM teams WHERE short_code = 'HER' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'HLC' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

-- September 18, 2025 - Evening Session
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-18T15:00:00Z', 'Field 4',
 (SELECT id FROM teams WHERE short_code = 'IP' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'SRE' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-18T15:00:00Z', 'Main Field',
 (SELECT id FROM teams WHERE short_code = 'OAK' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'INV' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-18T15:00:00Z', 'Field 2',
 (SELECT id FROM teams WHERE short_code = 'FH' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'IH' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-18T15:00:00Z', 'Field 3',
 (SELECT id FROM teams WHERE short_code = 'BDS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'HLC' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

-- September 19, 2025 - Morning Session
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-19T10:00:00Z', 'Main Field',
 (SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'OAK' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-19T10:00:00Z', 'Field 2',
 (SELECT id FROM teams WHERE short_code = 'AB' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'FH' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-19T10:00:00Z', 'Field 3',
 (SELECT id FROM teams WHERE short_code = 'HER' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'BDS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-19T10:00:00Z', 'Field 4',
 (SELECT id FROM teams WHERE short_code = 'IP' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'DA' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

-- September 19, 2025 - Evening Session
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-19T15:00:00Z', 'Main Field',
 (SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'INV' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-19T15:00:00Z', 'Field 2',
 (SELECT id FROM teams WHERE short_code = 'AB' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'IH' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-19T15:00:00Z', 'Field 3',
 (SELECT id FROM teams WHERE short_code = 'HER' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'HLC' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-19T15:00:00Z', 'Field 4',
 (SELECT id FROM teams WHERE short_code = 'IP' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'SRE' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

-- September 20, 2025 - Morning Session
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-20T10:00:00Z', 'Main Field',
 (SELECT id FROM teams WHERE short_code = 'OAK' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'INV' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-20T10:00:00Z', 'Field 2',
 (SELECT id FROM teams WHERE short_code = 'FH' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'IH' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-20T10:00:00Z', 'Field 3',
 (SELECT id FROM teams WHERE short_code = 'BDS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'HLC' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

-- September 20, 2025 - Evening Session
((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-20T15:00:00Z', 'Field 4',
 (SELECT id FROM teams WHERE short_code = 'DA' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'SRE' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-20T15:00:00Z', 'Main Field',
 (SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'INV' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-20T15:00:00Z', 'Field 2',
 (SELECT id FROM teams WHERE short_code = 'AB' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'IH' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-20T15:00:00Z', 'Field 3',
 (SELECT id FROM teams WHERE short_code = 'HER' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'HLC' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0),

((SELECT id FROM sports WHERE slug = 'football-u19'), 'Group', '2025-09-20T15:00:00Z', 'Field 4',
 (SELECT id FROM teams WHERE short_code = 'KCI' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')),
 (SELECT id FROM teams WHERE short_code = 'PW' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0);
