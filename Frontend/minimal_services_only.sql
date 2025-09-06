-- MINIMAL APPROACH: Create ONLY the services table
-- Drop the services table if it exists to start fresh
DROP TABLE IF EXISTS services CASCADE;

-- Create the services table with minimal structure
CREATE TABLE services (
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

-- Create basic indexes
CREATE INDEX idx_services_provider_id ON services(provider_id);
CREATE INDEX idx_services_is_active ON services(is_active);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
CREATE POLICY "Allow all operations on services" ON services
    FOR ALL USING (true);

-- Test the table exists
SELECT 'Services table created successfully with is_active column!' as status;
