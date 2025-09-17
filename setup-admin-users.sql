-- Setup Admin Users for ISSO Scoreboard
-- Run this in Supabase SQL Editor after setting up the main schema

-- First, create admin users in Supabase Dashboard > Authentication > Users
-- Then run this script to set their profiles

-- Example admin users (replace with actual user IDs from Supabase)
-- To get user IDs: Go to Supabase Dashboard > Authentication > Users

-- Create profiles for admin users
INSERT INTO profiles (user_id, role) VALUES
-- Replace these with your actual user IDs
('admin1-user-id-here', 'Admin'),
('admin2-user-id-here', 'Admin'),
('admin3-user-id-here', 'Admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'Admin';

-- Verify the setup
SELECT 
  p.user_id,
  p.role,
  au.email
FROM profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
WHERE p.role = 'Admin';

-- Instructions for creating admin users:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" 
-- 3. Enter email and password for each admin
-- 4. Copy the user IDs and replace them in the INSERT statement above
-- 5. Run this script to set their profiles as Admin
