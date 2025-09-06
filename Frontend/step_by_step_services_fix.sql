-- STEP 1: Check if providers table exists and create it if needed
-- First, let's create the providers table if it doesn't exist
CREATE TABLE IF NOT EXISTS providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    description TEXT,
    skills TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    hourly_rate DECIMAL(10,2),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    user_type VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 4: Now create the services table
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

-- STEP 5: Create indexes for services table
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_location ON services(location);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);

-- STEP 6: Enable RLS on services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- STEP 7: Create RLS Policies for services table
DROP POLICY IF EXISTS "Allow public service creation" ON services;
CREATE POLICY "Allow public service creation" ON services
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public service reading" ON services;
CREATE POLICY "Allow public service reading" ON services
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service owner update" ON services;
CREATE POLICY "Allow service owner update" ON services
    FOR UPDATE USING (provider_id = auth.uid());

DROP POLICY IF EXISTS "Allow service owner delete" ON services;
CREATE POLICY "Allow service owner delete" ON services
    FOR DELETE USING (provider_id = auth.uid());

-- STEP 8: Add service_id column to bookings table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'service_id'
    ) THEN
        ALTER TABLE bookings ADD COLUMN service_id UUID REFERENCES services(id) ON DELETE CASCADE;
    END IF;
END $$;

-- STEP 9: Create index for service_id in bookings
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);

-- STEP 10: Success message
SELECT 'All tables created successfully! Services table is ready to use.' as status;
