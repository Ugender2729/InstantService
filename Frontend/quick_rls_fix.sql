-- Quick RLS Fix for Provider Registration
-- Run this in your Supabase SQL Editor to fix the 403 error

-- Enable RLS on providers table
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert provider data (for registration)
CREATE POLICY "Allow public provider registration" ON providers
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anyone to read provider data (for browsing)
CREATE POLICY "Allow public provider read" ON providers
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert user data (for registration)
CREATE POLICY "Allow public user registration" ON users
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anyone to read user data (for browsing)
CREATE POLICY "Allow public user read" ON users
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- Enable RLS on services table (if it exists)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert service data
CREATE POLICY "Allow public service creation" ON services
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anyone to read service data
CREATE POLICY "Allow public service read" ON services
    FOR SELECT 
    TO anon, authenticated
    USING (true);
