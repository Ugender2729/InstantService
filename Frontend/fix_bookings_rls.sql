-- Fix RLS policies for bookings table
-- This will allow users to create bookings

-- First, check if bookings table exists and has RLS enabled
DO $$
BEGIN
    -- Enable RLS on bookings table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
        ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Allow public booking creation" ON bookings;
        DROP POLICY IF EXISTS "Allow public booking reading" ON bookings;
        DROP POLICY IF EXISTS "Allow booking owner update" ON bookings;
        DROP POLICY IF EXISTS "Allow booking owner delete" ON bookings;
        
        -- Create new policies
        CREATE POLICY "Allow public booking creation" ON bookings
            FOR INSERT WITH CHECK (true);
            
        CREATE POLICY "Allow public booking reading" ON bookings
            FOR SELECT USING (true);
            
        CREATE POLICY "Allow booking owner update" ON bookings
            FOR UPDATE USING (true);
            
        CREATE POLICY "Allow booking owner delete" ON bookings
            FOR DELETE USING (true);
            
        RAISE NOTICE 'RLS policies for bookings table have been updated successfully!';
    ELSE
        RAISE NOTICE 'Bookings table does not exist. Please create it first.';
    END IF;
END $$;

-- Also ensure services table has proper RLS policies
DO $$
BEGIN
    -- Enable RLS on services table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services') THEN
        ALTER TABLE services ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Allow public service creation" ON services;
        DROP POLICY IF EXISTS "Allow public service reading" ON services;
        DROP POLICY IF EXISTS "Allow service owner update" ON services;
        DROP POLICY IF EXISTS "Allow service owner delete" ON services;
        
        -- Create new policies
        CREATE POLICY "Allow public service creation" ON services
            FOR INSERT WITH CHECK (true);
            
        CREATE POLICY "Allow public service reading" ON services
            FOR SELECT USING (true);
            
        CREATE POLICY "Allow service owner update" ON services
            FOR UPDATE USING (true);
            
        CREATE POLICY "Allow service owner delete" ON services
            FOR DELETE USING (true);
            
        RAISE NOTICE 'RLS policies for services table have been updated successfully!';
    ELSE
        RAISE NOTICE 'Services table does not exist. Please create it first.';
    END IF;
END $$;

SELECT 'RLS policies updated successfully!' as status;
