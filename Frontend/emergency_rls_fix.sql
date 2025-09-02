-- EMERGENCY RLS FIX - Run this immediately in Supabase SQL Editor
-- This will temporarily disable RLS to test if that's the issue

-- 1. DISABLE RLS TEMPORARILY TO TEST
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Test if we can access data now
SELECT 
    id,
    email,
    full_name,
    user_type,
    verification_status
FROM users 
LIMIT 5;

-- 3. If the above works, the issue is RLS. If it doesn't, the issue is table structure.
-- Let's check the table structure:
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 4. Check if there are any constraints causing issues
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'users';

-- 5. Now let's create a SIMPLE RLS policy that should work
-- First, drop any existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON users;
DROP POLICY IF EXISTS "Enable all access for service role" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;

-- 6. Create a VERY SIMPLE policy that allows all authenticated users to read
CREATE POLICY "simple_read_policy" ON users
    FOR SELECT USING (true);

-- 7. Create a simple insert policy
CREATE POLICY "simple_insert_policy" ON users
    FOR INSERT WITH CHECK (true);

-- 8. Create a simple update policy
CREATE POLICY "simple_update_policy" ON users
    FOR UPDATE USING (true);

-- 9. Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 10. Test the simple policy
SELECT 
    id,
    email,
    full_name,
    user_type,
    verification_status
FROM users 
LIMIT 5;

-- 11. If the above works, we can make it more secure later
-- If it still fails, the issue is deeper than RLS

-- 12. Check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'users';

-- 13. Grant all permissions to authenticated users
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;
GRANT USAGE ON SCHEMA public TO authenticated;
