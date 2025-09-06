-- Test query to check if services table has data
SELECT 
    id,
    title,
    description,
    category,
    hourly_rate,
    location,
    is_active,
    provider_id,
    created_at
FROM services 
ORDER BY created_at DESC 
LIMIT 10;

-- Also check providers table
SELECT 
    id,
    full_name,
    email,
    is_verified,
    verification_status
FROM providers 
ORDER BY created_at DESC 
LIMIT 10;
