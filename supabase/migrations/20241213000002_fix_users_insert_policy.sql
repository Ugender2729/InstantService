-- Add missing INSERT policy for users table
CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Also add a policy to allow users to view all profiles (for admin purposes)
CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT USING (true);
