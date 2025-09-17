# User Management Guide

## How to Set Up Users

### 1. Create User Accounts in Supabase

1. **Go to Supabase Dashboard** → Authentication → Users
2. **Click "Add user"** for each person who needs access
3. **Enter their details:**
   - Email address
   - Password (they'll use this to sign in)
   - Confirm password
4. **Click "Create user"**
5. **Copy the User ID** (you'll need this for the next step)

### 2. Set User Roles and Permissions

1. **Go to Supabase Dashboard** → SQL Editor
2. **Run the `create-users.sql` script** with your actual user IDs
3. **Or manually set roles:**

```sql
-- Set user as Admin (can edit any match)
UPDATE profiles 
SET role = 'Admin' 
WHERE user_id = 'USER_ID_FROM_STEP_1';

-- Set user as Scorer (can edit specific team matches)
UPDATE profiles 
SET role = 'Scorer' 
WHERE user_id = 'USER_ID_FROM_STEP_1';
```

### 3. Assign Team Access to Scorers

```sql
-- Give scorer access to a specific team
INSERT INTO team_members (team_id, user_id, approved) VALUES
((SELECT id FROM teams WHERE short_code = 'JPIS'), 'USER_ID', true);
```

## User Roles

### **Admin**
- Can edit any match
- Can finalize matches
- Can manage other users
- Full access to all features

### **Scorer**
- Can only edit matches for their assigned teams
- Cannot edit final matches
- Cannot manage other users

### **Viewer** (Default)
- Can only view matches
- Cannot edit anything

## Example Setup

### For a Football Coach:
1. Create user: `coach@school.com` / `password123`
2. Set role: `Scorer`
3. Assign team: `JPIS` (Football U19)

### For Tournament Admin:
1. Create user: `admin@tournament.com` / `admin123`
2. Set role: `Admin`
3. No team assignment needed (can edit all matches)

## Testing

1. **Go to** `http://localhost:5173/profile`
2. **Sign in** with the email/password you created
3. **Check the role** displayed in the profile
4. **Go to a scoreboard** and verify edit permissions work

## Security Notes

- Users can only sign in with pre-created accounts
- No self-registration allowed
- Passwords are managed by Supabase
- Roles and permissions are controlled by you
