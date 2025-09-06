-- Reset RLS Policies for InstaServe
-- This will drop existing policies and recreate them

-- =============================================
-- DROP EXISTING POLICIES
-- =============================================

-- Drop existing users table policies
DROP POLICY IF EXISTS "Allow public user registration" ON users;
DROP POLICY IF EXISTS "Allow public user read" ON users;
DROP POLICY IF EXISTS "Allow user self update" ON users;
DROP POLICY IF EXISTS "Allow user self delete" ON users;

-- Drop existing providers table policies
DROP POLICY IF EXISTS "Allow public provider registration" ON providers;
DROP POLICY IF EXISTS "Allow public provider read" ON providers;
DROP POLICY IF EXISTS "Allow provider self update" ON providers;
DROP POLICY IF EXISTS "Allow provider self delete" ON providers;

-- =============================================
-- RECREATE POLICIES
-- =============================================

-- USERS TABLE POLICIES (Find Services)
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert user data (for customer registration)
CREATE POLICY "Allow public user registration" ON users
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anyone to read user data (for browsing customers)
CREATE POLICY "Allow public user read" ON users
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- Allow users to update their own data
CREATE POLICY "Allow user self update" ON users
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow users to delete their own data
CREATE POLICY "Allow user self delete" ON users
    FOR DELETE 
    TO authenticated
    USING (auth.uid() = id);

-- PROVIDERS TABLE POLICIES (Provide Services)
-- Enable RLS on providers table
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert provider data (for provider registration)
CREATE POLICY "Allow public provider registration" ON providers
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anyone to read provider data (for browsing providers)
CREATE POLICY "Allow public provider read" ON providers
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- Allow providers to update their own data
CREATE POLICY "Allow provider self update" ON providers
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow providers to delete their own data
CREATE POLICY "Allow provider self delete" ON providers
    FOR DELETE 
    TO authenticated
    USING (auth.uid() = id);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
SELECT 'RLS policies reset successfully!' as status;
