-- Quick Admin Setup
-- Run this in Supabase SQL Editor after creating your user account

-- First, find your user ID from the auth.users table
-- You can get this from Supabase Dashboard > Authentication > Users

-- Replace 'YOUR_USER_ID_HERE' with your actual user ID
-- To find your user ID: Go to Supabase Dashboard > Authentication > Users > Copy the UUID

-- Update your profile to Admin role
UPDATE profiles 
SET role = 'Admin' 
WHERE user_id = 'YOUR_USER_ID_HERE';

-- If you don't have a profile yet, create one
INSERT INTO profiles (user_id, role)
SELECT 'YOUR_USER_ID_HERE', 'Admin'
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE user_id = 'YOUR_USER_ID_HERE'
);

-- Verify the update
SELECT * FROM profiles WHERE user_id = 'YOUR_USER_ID_HERE';
