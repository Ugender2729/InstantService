-- Check Providers Table Structure
-- This will show the current structure of the providers table

-- Show providers table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'providers' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data from providers table
SELECT * FROM providers LIMIT 5;

-- Count total providers
SELECT COUNT(*) as total_providers FROM providers;
