-- Add address column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(255) NOT NULL DEFAULT '';

-- Add verification_status column to users table for provider verification
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- Add RLS policies for users table
CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can view all profiles" ON users
    FOR SELECT USING (true);

-- Add admin policies for verification management
CREATE POLICY IF NOT EXISTS "Admins can update verification status" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );
