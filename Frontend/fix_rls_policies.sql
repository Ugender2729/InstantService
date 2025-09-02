-- Fix RLS Policies for users table
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';

-- 2. Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON users;

-- 3. Create proper RLS policies
-- Policy 1: Allow authenticated users to view all user profiles
CREATE POLICY "Enable read access for all users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy 2: Allow authenticated users to insert their own profile
CREATE POLICY "Enable insert for authenticated users only" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy 3: Allow users to update their own profile
CREATE POLICY "Enable update for users based on user_id" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Policy 4: Allow service role to do everything (for admin operations)
CREATE POLICY "Enable all access for service role" ON users
    FOR ALL USING (auth.role() = 'service_role');

-- 4. Enable RLS on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 6. Test the policies by checking if a user can view data
-- This should work now:
-- SELECT * FROM users LIMIT 1;

-- 7. Check if the table structure is correct
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 8. Verify RLS is working
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'users';
