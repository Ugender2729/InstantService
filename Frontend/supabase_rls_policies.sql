-- RLS Policies for InstaServe Database
-- These policies allow public access for registration but verify all details except password

-- Enable RLS on providers table
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Enable RLS on users table  
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROVIDERS TABLE POLICIES
-- =============================================

-- Allow anyone to insert provider data (for registration)
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
    USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);

-- Allow providers to delete their own data
CREATE POLICY "Allow provider self delete" ON providers
    FOR DELETE 
    TO authenticated
    USING (auth.uid()::text = id);

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- Allow anyone to insert user data (for registration)
CREATE POLICY "Allow public user registration" ON users
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anyone to read user data (for browsing users)
CREATE POLICY "Allow public user read" ON users
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- Allow users to update their own data
CREATE POLICY "Allow user self update" ON users
    FOR UPDATE 
    TO authenticated
    USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);

-- Allow users to delete their own data
CREATE POLICY "Allow user self delete" ON users
    FOR DELETE 
    TO authenticated
    USING (auth.uid()::text = id);

-- =============================================
-- SERVICES TABLE POLICIES
-- =============================================

-- Allow anyone to insert service data (for service posting)
CREATE POLICY "Allow public service creation" ON services
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anyone to read service data (for browsing services)
CREATE POLICY "Allow public service read" ON services
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- Allow service owners to update their own services
CREATE POLICY "Allow service owner update" ON services
    FOR UPDATE 
    TO authenticated
    USING (auth.uid()::text = provider_id)
    WITH CHECK (auth.uid()::text = provider_id);

-- Allow service owners to delete their own services
CREATE POLICY "Allow service owner delete" ON services
    FOR DELETE 
    TO authenticated
    USING (auth.uid()::text = provider_id);

-- =============================================
-- ADDITIONAL HELPER POLICIES
-- =============================================

-- Allow public access to service categories
CREATE POLICY "Allow public category read" ON service_categories
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- Allow public access to bookings
CREATE POLICY "Allow public booking read" ON bookings
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- Allow users to create bookings
CREATE POLICY "Allow public booking creation" ON bookings
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Allow booking participants to update bookings
CREATE POLICY "Allow booking participant update" ON bookings
    FOR UPDATE 
    TO authenticated
    USING (auth.uid()::text = customer_id OR auth.uid()::text = provider_id)
    WITH CHECK (auth.uid()::text = customer_id OR auth.uid()::text = provider_id);

-- =============================================
-- VERIFICATION POLICIES (Optional - for future use)
-- =============================================

-- Policy to allow admin verification of providers
CREATE POLICY "Allow admin provider verification" ON providers
    FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()::text 
            AND users.user_type = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()::text 
            AND users.user_type = 'admin'
        )
    );

-- =============================================
-- NOTES
-- =============================================
/*
These policies provide:

1. PUBLIC REGISTRATION: Anyone can register as provider/user without authentication
2. PUBLIC BROWSING: Anyone can view providers, users, and services
3. SELF-MANAGEMENT: Users can only update/delete their own data
4. VERIFICATION: All details are stored and can be verified except passwords
5. ADMIN ACCESS: Admins can verify providers (when admin system is implemented)

The policies ensure:
- No password exposure in any policy
- All user details are stored and verifiable
- Public access for browsing and registration
- Secure self-management of data
- Future-ready for admin verification system
*/
