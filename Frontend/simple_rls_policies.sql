-- Simple RLS Policies for InstaServe
-- Only for users and providers tables (2 tables only)

-- =============================================
-- USERS TABLE POLICIES (Find Services)
-- =============================================

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

-- =============================================
-- PROVIDERS TABLE POLICIES (Provide Services)
-- =============================================

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
-- SUMMARY
-- =============================================
/*
This creates RLS policies for only 2 tables:

1. USERS TABLE (Find Services):
   - Public registration ✅
   - Public browsing ✅
   - Self-update ✅
   - Self-delete ✅

2. PROVIDERS TABLE (Provide Services):
   - Public registration ✅
   - Public browsing ✅
   - Self-update ✅
   - Self-delete ✅

No services table policies - only 2 tables as requested!
*/
