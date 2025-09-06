-- Check existing RLS policies
-- Run this to see what policies are currently active

-- Check users table policies
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
WHERE tablename IN ('users', 'providers')
ORDER BY tablename, policyname;

-- Check if RLS is enabled on tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('users', 'providers')
ORDER BY tablename;
