-- Simple Providers Table Fix (No Rename Issues)
-- This will add all missing columns for provider verification

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

-- Add proper hourly_rate if it doesn't exist (keeping existing hourly_rat if it exists)
ALTER TABLE providers ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2) DEFAULT 0.00;

-- Add indexes for better performance and verification
CREATE INDEX IF NOT EXISTS idx_providers_email ON providers(email);
CREATE INDEX IF NOT EXISTS idx_providers_phone ON providers(phone);
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_verification_status ON providers(verification_status);
CREATE INDEX IF NOT EXISTS idx_providers_is_verified ON providers(is_verified);

-- Add constraints for data validation (using DO block to avoid IF NOT EXISTS issues)
DO $$ 
BEGIN
    -- Add verification status constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'chk_verification_status' 
                   AND table_name = 'providers' 
                   AND table_schema = 'public') THEN
        ALTER TABLE providers ADD CONSTRAINT chk_verification_status CHECK (verification_status IN ('pending', 'approved', 'rejected'));
    END IF;
    
    -- Add hourly rate constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'chk_hourly_rate' 
                   AND table_name = 'providers' 
                   AND table_schema = 'public') THEN
        ALTER TABLE providers ADD CONSTRAINT chk_hourly_rate CHECK (hourly_rate >= 0);
    END IF;
END $$;

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
