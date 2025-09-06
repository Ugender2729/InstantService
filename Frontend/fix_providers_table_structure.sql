-- Fix Providers Table Structure for Complete Verification
-- This will add all missing columns for proper provider verification

-- Add missing essential columns to providers table
ALTER TABLE providers ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE providers ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
ALTER TABLE providers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE providers ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE providers ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE providers ADD COLUMN IF NOT EXISTS skills TEXT;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE providers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Rename hourly_rat to hourly_rate if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'providers' 
               AND column_name = 'hourly_rat' 
               AND table_schema = 'public') THEN
        ALTER TABLE providers RENAME COLUMN hourly_rat TO hourly_rate;
    END IF;
END $$;

-- Add proper hourly_rate if it doesn't exist
ALTER TABLE providers ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2) DEFAULT 0.00;

-- Add indexes for better performance and verification
CREATE INDEX IF NOT EXISTS idx_providers_email ON providers(email);
CREATE INDEX IF NOT EXISTS idx_providers_phone ON providers(phone);
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_verification_status ON providers(verification_status);
CREATE INDEX IF NOT EXISTS idx_providers_is_verified ON providers(is_verified);

-- Add constraints for data validation
ALTER TABLE providers ADD CONSTRAINT IF NOT EXISTS chk_verification_status CHECK (verification_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE providers ADD CONSTRAINT IF NOT EXISTS chk_hourly_rate CHECK (hourly_rate >= 0);

-- Update existing records to have proper verification status
UPDATE providers SET verification_status = 'pending' WHERE verification_status IS NULL;
UPDATE providers SET is_verified = FALSE WHERE is_verified IS NULL;

-- Show the updated table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'providers' 
AND table_schema = 'public'
ORDER BY ordinal_position;
