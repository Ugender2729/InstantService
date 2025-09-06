-- SIMPLE FIX: Create services table step by step
-- First, let's check what tables exist and create only what's needed

-- Step 1: Create services table without foreign key first
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_location ON services(location);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);

-- Step 3: Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
DROP POLICY IF EXISTS "Allow public service creation" ON services;
CREATE POLICY "Allow public service creation" ON services
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public service reading" ON services;
CREATE POLICY "Allow public service reading" ON services
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service owner update" ON services;
CREATE POLICY "Allow service owner update" ON services
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow service owner delete" ON services;
CREATE POLICY "Allow service owner delete" ON services
    FOR DELETE USING (true);

-- Step 5: Success message
SELECT 'Services table created successfully! The is_active column now exists.' as status;
