-- Fix Users Table Structure for Proper Verification
-- This will add missing columns and fix the table structure

-- Add missing essential columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'customer';
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Rename the 'xt' column to 'full_name' if it contains names
-- (You may need to check what's in the 'xt' column first)
-- ALTER TABLE users RENAME COLUMN xt TO full_name;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);

-- Update existing records to have proper user_type
UPDATE users SET user_type = 'customer' WHERE user_type IS NULL;

-- Add constraints
ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS chk_user_type CHECK (user_type IN ('customer', 'provider', 'admin'));
ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS chk_verification_status CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- Show the updated table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;
