-- Insert sample service categories
INSERT INTO service_categories (name, description, icon) VALUES
('House Cleaning', 'Professional house cleaning services', 'broom'),
('Plumbing', 'Plumbing repair and installation services', 'wrench'),
('Electrical', 'Electrical work and repairs', 'bolt'),
('Landscaping', 'Garden and yard maintenance', 'tree'),
('Carpentry', 'Woodwork and furniture repair', 'hammer'),
('Painting', 'Interior and exterior painting', 'paintbrush'),
('Moving', 'Moving and packing services', 'truck'),
('Pet Care', 'Pet sitting and walking services', 'paw'),
('Tutoring', 'Academic tutoring and lessons', 'book'),
('Photography', 'Professional photography services', 'camera');

-- Insert sample users (these would normally be created through auth)
INSERT INTO users (email, full_name, phone, user_type) VALUES
('john.doe@example.com', 'John Doe', '+1234567890', 'customer'),
('jane.smith@example.com', 'Jane Smith', '+1234567891', 'customer'),
('mike.johnson@example.com', 'Mike Johnson', '+1234567892', 'provider'),
('sarah.wilson@example.com', 'Sarah Wilson', '+1234567893', 'provider'),
('admin@instantservice.com', 'Admin User', '+1234567894', 'admin');

-- Insert sample providers
INSERT INTO providers (user_id, business_name, description, address, city, state, zip_code, hourly_rate, is_verified) VALUES
((SELECT id FROM users WHERE email = 'mike.johnson@example.com'), 'Mike''s Plumbing Co', 'Professional plumbing services for residential and commercial properties', '123 Main St', 'New York', 'NY', '10001', 75.00, true),
((SELECT id FROM users WHERE email = 'sarah.wilson@example.com'), 'Sarah''s Cleaning Service', 'Reliable and thorough house cleaning services', '456 Oak Ave', 'Los Angeles', 'CA', '90210', 45.00, true);

-- Insert provider services
INSERT INTO provider_services (provider_id, category_id) VALUES
((SELECT id FROM providers WHERE business_name = 'Mike''s Plumbing Co'), (SELECT id FROM service_categories WHERE name = 'Plumbing')),
((SELECT id FROM providers WHERE business_name = 'Sarah''s Cleaning Service'), (SELECT id FROM service_categories WHERE name = 'House Cleaning'));

-- Insert sample bookings
INSERT INTO bookings (customer_id, provider_id, service_category_id, booking_date, start_time, end_time, status, total_amount, notes) VALUES
((SELECT id FROM users WHERE email = 'john.doe@example.com'), 
 (SELECT id FROM providers WHERE business_name = 'Mike''s Plumbing Co'),
 (SELECT id FROM service_categories WHERE name = 'Plumbing'),
 '2024-12-15', '09:00:00', '11:00:00', 'confirmed', 150.00, 'Leaky faucet in kitchen'),
((SELECT id FROM users WHERE email = 'jane.smith@example.com'),
 (SELECT id FROM providers WHERE business_name = 'Sarah''s Cleaning Service'),
 (SELECT id FROM service_categories WHERE name = 'House Cleaning'),
 '2024-12-16', '10:00:00', '14:00:00', 'pending', 180.00, 'Deep cleaning of 2-bedroom apartment');

-- Insert sample reviews
INSERT INTO reviews (booking_id, customer_id, provider_id, rating, comment) VALUES
((SELECT id FROM bookings WHERE notes = 'Leaky faucet in kitchen'),
 (SELECT id FROM users WHERE email = 'john.doe@example.com'),
 (SELECT id FROM providers WHERE business_name = 'Mike''s Plumbing Co'),
 5, 'Excellent service! Fixed the issue quickly and professionally.');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
((SELECT id FROM users WHERE email = 'john.doe@example.com'), 'Booking Confirmed', 'Your plumbing appointment with Mike''s Plumbing Co has been confirmed for Dec 15, 2024.', 'success'),
((SELECT id FROM users WHERE email = 'jane.smith@example.com'), 'New Booking Request', 'You have a new booking request for house cleaning on Dec 16, 2024.', 'info');

