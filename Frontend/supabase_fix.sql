-- Fix for provider registration issues
-- Run this in your Supabase SQL Editor

-- 1. Add address column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(255) DEFAULT '';

-- 2. Add verification_status column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- 3. Update existing users to have default values
UPDATE users SET address = '' WHERE address IS NULL;
UPDATE users SET verification_status = 'pending' WHERE verification_status IS NULL;

-- 4. Make sure RLS policies are correct
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view all profiles" ON users;
CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 5. Check current table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
