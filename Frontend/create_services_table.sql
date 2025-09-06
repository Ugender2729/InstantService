-- Create services table to store posted services from providers
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_location ON services(location);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);

-- Enable RLS on services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services table
-- Public Creation - Anyone can create services
CREATE POLICY "Allow public service creation" ON services
    FOR INSERT WITH CHECK (true);

-- Public Browsing - Anyone can read services
CREATE POLICY "Allow public service reading" ON services
    FOR SELECT USING (true);

-- Owner-Update - Service owners can update their services
CREATE POLICY "Allow service owner update" ON services
    FOR UPDATE USING (provider_id = auth.uid());

-- Owner-Delete - Service owners can delete their services
CREATE POLICY "Allow service owner delete" ON services
    FOR DELETE USING (provider_id = auth.uid());

-- Update the bookings table to reference services instead of service_category_id
ALTER TABLE bookings DROP COLUMN IF EXISTS service_category_id;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id) ON DELETE CASCADE;

-- Create index for service_id in bookings
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);

SELECT 'Services table created successfully with RLS policies!' as status;
