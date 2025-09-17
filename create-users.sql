-- Create User Accounts Script
-- Run this in Supabase SQL Editor to create user accounts

-- Note: You'll need to create users through Supabase Dashboard first:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" 
-- 3. Enter email and password for each user
-- 4. Copy the user IDs and use them below

-- Example: Create profiles for your users
-- Replace the user IDs with actual ones from Supabase Dashboard

-- Admin user (replace with actual user ID)
INSERT INTO profiles (user_id, role) VALUES
('USER_ID_1', 'Admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'Admin';

-- Scorer users for specific teams
INSERT INTO profiles (user_id, role) VALUES
('USER_ID_2', 'Scorer'),
('USER_ID_3', 'Scorer'),
('USER_ID_4', 'Scorer')
ON CONFLICT (user_id) DO UPDATE SET role = 'Scorer';

-- Assign team access to scorers
-- Replace team IDs with actual ones from your teams table

-- Example: Assign JPIS team access to scorer
INSERT INTO team_members (team_id, user_id, approved) VALUES
((SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 'USER_ID_2', true),
((SELECT id FROM teams WHERE short_code = 'JPIS' AND sport_id = (SELECT id FROM sports WHERE slug = 'basketball-u17-boys')), 'USER_ID_2', true)
ON CONFLICT (team_id, user_id) DO UPDATE SET approved = true;

-- Add more team assignments as needed...

-- Verify the setup
SELECT 
  p.user_id,
  p.role,
  array_agg(t.name) as teams
FROM profiles p
LEFT JOIN team_members tm ON p.user_id = tm.user_id
LEFT JOIN teams t ON tm.team_id = t.id AND tm.approved = true
GROUP BY p.user_id, p.role
ORDER BY p.role, p.user_id;
