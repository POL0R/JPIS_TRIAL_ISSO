-- U17 Girls Basketball Data
-- Run this in your Supabase SQL Editor after running the main schema

-- First, insert teams for Basketball U17 Girls
INSERT INTO teams (sport_id, name, short_code, group_name) VALUES
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Don Bosco', 'DB', 'A'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Adani', 'ADA', 'A'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'DPSI', 'DPSI', 'A'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Navrachna', 'NAV', 'B'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Sancta Maria', 'SM', 'B'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Aditya Birla World', 'ABW', 'B'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Ascend', 'ASC', 'C'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Anand Niketan', 'AN', 'C'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Heritage', 'HER', 'C'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'The Shri Ram School', 'TSR', 'C'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'GEMS', 'GEMS', 'C'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Oberoi Goregaon', 'OG', 'D'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Fountainhead', 'FH', 'D'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Scottish High', 'SH', 'D'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Yellow Train School', 'YTS', 'D'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Blue Ridge Public School', 'BRPS', 'D')
ON CONFLICT (sport_id, short_code) DO NOTHING;

-- Insert matches for Basketball U17 Girls
INSERT INTO matches (sport_id, stage, starts_at, venue, home_team_id, away_team_id, home_score, away_score) VALUES
-- September 18, 2025 - Morning Session
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T10:00:00Z', 'Court 1',
 (SELECT id FROM teams WHERE short_code = 'DB' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'ADA' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T10:00:00Z', 'Court 2',
 (SELECT id FROM teams WHERE short_code = 'NAV' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'SM' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T10:00:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'ASC' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'AN' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T10:00:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'OG' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'FH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

-- September 18, 2025 - Morning Session (continued)
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T10:30:00Z', 'Court 1',
 (SELECT id FROM teams WHERE short_code = 'DB' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'DPSI' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T10:30:00Z', 'Court 2',
 (SELECT id FROM teams WHERE short_code = 'NAV' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'ABW' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T10:30:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'HER' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'TSR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T10:30:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'SH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'YTS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

-- September 18, 2025 - Evening Session
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T15:00:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'ASC' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'GEMS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T15:00:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'OG' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'BRPS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T15:00:00Z', 'Court 1',
 (SELECT id FROM teams WHERE short_code = 'DPSI' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'ADA' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-18T15:00:00Z', 'Court 2',
 (SELECT id FROM teams WHERE short_code = 'ABW' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'SM' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

-- September 19, 2025 - Morning Session
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-19T10:00:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'HER' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'AN' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-19T10:00:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'SH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'FH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-19T10:00:00Z', 'Court 1',
 (SELECT id FROM teams WHERE short_code = 'DB' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'ADA' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-19T10:00:00Z', 'Court 2',
 (SELECT id FROM teams WHERE short_code = 'NAV' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'SM' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

-- September 19, 2025 - Evening Session
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-19T15:00:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'TSR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'GEMS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-19T15:00:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'YTS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'BRPS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-19T15:00:00Z', 'Court 1',
 (SELECT id FROM teams WHERE short_code = 'DB' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'DPSI' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-19T15:00:00Z', 'Court 2',
 (SELECT id FROM teams WHERE short_code = 'NAV' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'ABW' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

-- September 20, 2025 - Morning Session
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-20T10:00:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'HER' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'ASC' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-20T10:00:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'SH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'OG' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-20T10:00:00Z', 'Court 1',
 (SELECT id FROM teams WHERE short_code = 'DPSI' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'ADA' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-20T10:00:00Z', 'Court 2',
 (SELECT id FROM teams WHERE short_code = 'ABW' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'SM' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

-- September 20, 2025 - Evening Session
((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-20T15:00:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'TSR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'AN' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-girls'), 'Group', '2025-09-20T15:00:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'YTS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')),
 (SELECT id FROM teams WHERE short_code = 'FH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-girls')), 0, 0);
