-- Fix Admin Profile
-- Run this in your Supabase SQL editor to create the admin profile

-- First, let's check if the user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE id = 'e6e7bc2f-b3ad-4113-bafc-eabe8bac36fe';

-- Create the admin profile
INSERT INTO profiles (user_id, role) 
VALUES ('e6e7bc2f-b3ad-4113-bafc-eabe8bac36fe', 'Admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'Admin';

-- Verify the profile was created
SELECT * FROM profiles WHERE user_id = 'e6e7bc2f-b3ad-4113-bafc-eabe8bac36fe';

-- Also check if there are any RLS policy issues
-- Let's temporarily disable RLS on profiles to test
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS after testing
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
