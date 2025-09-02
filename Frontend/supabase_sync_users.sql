-- Sync users table with auth.users table
-- Run this in your Supabase SQL Editor

-- 1. First, let's check what we have in the users table
SELECT 
    id,
    email,
    full_name,
    user_type,
    verification_status,
    created_at
FROM users 
WHERE user_type = 'provider'
ORDER BY created_at DESC;

-- 2. Update user_type for all users based on their verification_status
UPDATE users 
SET user_type = 'provider' 
WHERE verification_status IN ('pending', 'approved', 'rejected') 
AND user_type != 'provider';

-- 3. Add missing columns if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) DEFAULT 'customer' CHECK (user_type IN ('customer', 'provider', 'admin'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- 4. Update verification_status for existing providers
UPDATE users 
SET verification_status = 'pending' 
WHERE user_type = 'provider' 
AND (verification_status IS NULL OR verification_status = '');

-- 5. Show the final state
SELECT 
    id,
    email,
    full_name,
    user_type,
    verification_status,
    created_at
FROM users 
WHERE user_type = 'provider'
ORDER BY created_at DESC;

-- 6. Create a function to sync user metadata
CREATE OR REPLACE FUNCTION sync_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- Update auth.users metadata when users table changes
    UPDATE auth.users 
    SET raw_user_meta_data = jsonb_build_object(
        'user_type', NEW.user_type,
        'verification_status', NEW.verification_status,
        'full_name', NEW.full_name,
        'phone', NEW.phone
    )
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create trigger to automatically sync changes
DROP TRIGGER IF EXISTS sync_user_metadata_trigger ON users;
CREATE TRIGGER sync_user_metadata_trigger
    AFTER INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_metadata();

-- 8. Test the trigger by updating a user
-- UPDATE users SET verification_status = 'approved' WHERE email = 'bjayanth12@gmail.com' LIMIT 1;

-- 9. Check auth.users metadata
SELECT 
    id,
    email,
    raw_user_meta_data
FROM auth.users 
WHERE email IN (
    SELECT email FROM users WHERE user_type = 'provider'
)
ORDER BY created_at DESC;
