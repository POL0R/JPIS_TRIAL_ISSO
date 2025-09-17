-- U17 Boys Basketball Data
-- Run this in your Supabase SQL Editor after running the main schema

-- First, insert teams for Basketball U17 Boys
INSERT INTO teams (sport_id, name, short_code, group_name) VALUES
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Corvuss', 'COR', 'A'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Ecole', 'ECO', 'A'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'The Bombay International School', 'TBIS', 'A'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'The Shri Ram School', 'TSR', 'B'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Garodia', 'GAR', 'B'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Tagore International', 'TI', 'B'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Sancta Maria', 'SM', 'C'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'JBCN Parel', 'JBCN', 'C'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Fountainhead', 'FH', 'C'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'JPIS', 'JPIS', 'D'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Nahar', 'NAH', 'D'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'PATHWAYS WORLD SCHOOL, GURGAON', 'PWSG', 'D'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'CHIREC', 'CHI', 'E'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'DAIS', 'DAIS', 'E'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Yellow Train School', 'YTS', 'E'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'CNS', 'CNS', 'F'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Oberoi - JVLR', 'OJV', 'F'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Dhirubhai Ambani', 'DA', 'F'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Greenwood', 'GWD', 'G'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Don Bosco', 'DB', 'G'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Indus - Hyderabad', 'IH', 'G'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Sreenidhi', 'SRE', 'H'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'B.D. Somani', 'BDS', 'H'),
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Garodia - Ghatkopar', 'GAG', 'H')
ON CONFLICT (sport_id, short_code) DO NOTHING;

-- Insert matches for Basketball U17 Boys
INSERT INTO matches (sport_id, stage, starts_at, venue, home_team_id, away_team_id, home_score, away_score) VALUES
-- September 18, 2025 - Morning Session
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:00:00Z', 'Court 1',
 (SELECT id FROM teams WHERE short_code = 'COR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'ECO' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:00:00Z', 'Court 2',
 (SELECT id FROM teams WHERE short_code = 'TSR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'GAR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:00:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'SM' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'JBCN' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:00:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'NAH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:00:00Z', 'Court 5',
 (SELECT id FROM teams WHERE short_code = 'CHI' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'DAIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:00:00Z', 'Court 6',
 (SELECT id FROM teams WHERE short_code = 'CNS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'OJV' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:00:00Z', 'Court 7',
 (SELECT id FROM teams WHERE short_code = 'GWD' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'DB' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:00:00Z', 'Court 8',
 (SELECT id FROM teams WHERE short_code = 'SRE' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'BDS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

-- September 18, 2025 - Morning Session (continued)
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:30:00Z', 'Court 5',
 (SELECT id FROM teams WHERE short_code = 'DAIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'YTS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:30:00Z', 'Court 6',
 (SELECT id FROM teams WHERE short_code = 'OJV' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'DA' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:30:00Z', 'Court 7',
 (SELECT id FROM teams WHERE short_code = 'DB' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'IH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T10:30:00Z', 'Court 8',
 (SELECT id FROM teams WHERE short_code = 'BDS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'GAG' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

-- September 18, 2025 - Evening Session
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T15:00:00Z', 'Court 1',
 (SELECT id FROM teams WHERE short_code = 'COR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'TBIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T15:00:00Z', 'Court 2',
 (SELECT id FROM teams WHERE short_code = 'TSR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'TI' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T15:00:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'SM' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'FH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T15:00:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'PWSG' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T15:00:00Z', 'Court 5',
 (SELECT id FROM teams WHERE short_code = 'CHI' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'YTS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T15:00:00Z', 'Court 6',
 (SELECT id FROM teams WHERE short_code = 'CNS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'DA' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T15:00:00Z', 'Court 7',
 (SELECT id FROM teams WHERE short_code = 'GWD' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'IH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-18T15:00:00Z', 'Court 8',
 (SELECT id FROM teams WHERE short_code = 'SRE' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'GAG' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

-- September 19, 2025 - Morning Session
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T10:00:00Z', 'Court 1',
 (SELECT id FROM teams WHERE short_code = 'ECO' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'TBIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T10:00:00Z', 'Court 2',
 (SELECT id FROM teams WHERE short_code = 'GAR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'TI' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T10:00:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'JBCN' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'FH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T10:00:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'NAH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'PWSG' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T10:00:00Z', 'Court 5',
 (SELECT id FROM teams WHERE short_code = 'CHI' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'DAIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T10:00:00Z', 'Court 6',
 (SELECT id FROM teams WHERE short_code = 'CNS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'OJV' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T10:00:00Z', 'Court 7',
 (SELECT id FROM teams WHERE short_code = 'GWD' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'DB' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T10:00:00Z', 'Court 8',
 (SELECT id FROM teams WHERE short_code = 'SRE' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'BDS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

-- September 19, 2025 - Evening Session
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T15:00:00Z', 'Court 1',
 (SELECT id FROM teams WHERE short_code = 'COR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'ECO' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T15:00:00Z', 'Court 2',
 (SELECT id FROM teams WHERE short_code = 'TSR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'GAR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T15:00:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'SM' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'JBCN' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T15:00:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'NAH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T15:00:00Z', 'Court 5',
 (SELECT id FROM teams WHERE short_code = 'DAIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'YTS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T15:00:00Z', 'Court 6',
 (SELECT id FROM teams WHERE short_code = 'OJV' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'DA' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T15:00:00Z', 'Court 7',
 (SELECT id FROM teams WHERE short_code = 'DB' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'IH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-19T15:00:00Z', 'Court 8',
 (SELECT id FROM teams WHERE short_code = 'BDS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'GAG' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

-- September 20, 2025 - Morning Session
((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-20T10:00:00Z', 'Court 1',
 (SELECT id FROM teams WHERE short_code = 'TBIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'ECO' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-20T10:00:00Z', 'Court 2',
 (SELECT id FROM teams WHERE short_code = 'TI' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'GAR' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-20T10:00:00Z', 'Court 3',
 (SELECT id FROM teams WHERE short_code = 'FH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'JBCN' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0),

((SELECT id FROM sports WHERE slug = 'basketball-u17-boys'), 'Group', '2025-09-20T10:00:00Z', 'Court 4',
 (SELECT id FROM teams WHERE short_code = 'PWSG' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')),
 (SELECT id FROM teams WHERE short_code = 'NAH' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 0, 0);
