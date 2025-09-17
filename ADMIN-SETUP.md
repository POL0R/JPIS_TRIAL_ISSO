# Admin Setup Guide

## Overview
The ISSO Scoreboard now uses a simplified authentication system:
- **Viewers**: Can view all data without signing in
- **Admins**: Must sign in with email/password to edit scores
- **No public sign-up**: Only pre-created admin accounts

## Setting Up Admin Users

### Step 1: Create Admin Users in Supabase
1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Users**
3. Click **"Add user"**
4. Enter:
   - **Email**: `admin@example.com`
   - **Password**: `your-secure-password`
5. Click **"Create user"**
6. Repeat for each admin user you want to create

### Step 2: Set User Roles
1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query to set all users as admins:

```sql
-- Get user IDs first
SELECT id, email FROM auth.users;

-- Then update their profiles (replace with actual user IDs)
INSERT INTO profiles (user_id, role) VALUES
('user-id-1', 'Admin'),
('user-id-2', 'Admin'),
('user-id-3', 'Admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'Admin';
```

### Step 3: Test Admin Login
1. Go to `http://localhost:5173/profile`
2. Enter admin email and password
3. You should see "Admin Account" section with capabilities

## Admin Capabilities

Once signed in, admins can:
- ✅ Edit scores for all matches
- ✅ Finalize matches to lock them
- ✅ Add football goals with player details
- ✅ Update basketball scores directly
- ✅ Access admin panel for user management

## Security Notes

- All admin users have full access to edit any match
- No team-specific permissions (simplified system)
- Viewers can see all data but cannot edit
- Admin panel shows all users and their roles

## Troubleshooting

**"Access Denied" on admin panel:**
- Make sure user is signed in
- Check that user has 'Admin' role in profiles table

**Can't edit scores:**
- Sign in as admin first
- Check that match status is not 'Final'

**Database connection issues:**
- Verify `.env.local` has correct Supabase credentials
- Check that database schema is properly set up
