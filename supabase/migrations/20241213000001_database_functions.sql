-- Function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL,
    lon1 DECIMAL,
    lat2 DECIMAL,
    lon2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
    RETURN 6371 * acos(
        cos(radians(lat1)) * cos(radians(lat2)) * 
        cos(radians(lon2) - radians(lon1)) + 
        sin(radians(lat1)) * sin(radians(lat2))
    );
END;
$$ LANGUAGE plpgsql;

-- Function to search providers by location and service
CREATE OR REPLACE FUNCTION search_providers_nearby(
    search_lat DECIMAL,
    search_lon DECIMAL,
    search_radius DECIMAL DEFAULT 50,
    service_category_name TEXT DEFAULT NULL
) RETURNS TABLE (
    id UUID,
    business_name TEXT,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    hourly_rate DECIMAL,
    distance DECIMAL,
    service_categories JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.business_name,
        p.description,
        p.address,
        p.city,
        p.state,
        p.hourly_rate,
        calculate_distance(search_lat, search_lon, p.latitude, p.longitude) as distance,
        COALESCE(
            (SELECT json_agg(sc.name)
             FROM provider_services ps
             JOIN service_categories sc ON ps.category_id = sc.id
             WHERE ps.provider_id = p.id),
            '[]'::json
        ) as service_categories
    FROM providers p
    WHERE p.is_available = true
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND calculate_distance(search_lat, search_lon, p.latitude, p.longitude) <= search_radius
    AND (
        service_category_name IS NULL
        OR EXISTS (
            SELECT 1 FROM provider_services ps
            JOIN service_categories sc ON ps.category_id = sc.id
            WHERE ps.provider_id = p.id
            AND sc.name ILIKE '%' || service_category_name || '%'
        )
    )
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Function to get booking statistics for a provider
CREATE OR REPLACE FUNCTION get_provider_stats(provider_uuid UUID)
RETURNS TABLE (
    total_bookings BIGINT,
    completed_bookings BIGINT,
    cancelled_bookings BIGINT,
    total_earnings DECIMAL,
    avg_rating DECIMAL,
    total_reviews BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(b.id) as total_bookings,
        COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
        COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as cancelled_bookings,
        COALESCE(SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END), 0) as total_earnings,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as total_reviews
    FROM providers p
    LEFT JOIN bookings b ON p.id = b.provider_id
    LEFT JOIN reviews r ON p.id = r.provider_id
    WHERE p.id = provider_uuid
    GROUP BY p.id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user dashboard data
CREATE OR REPLACE FUNCTION get_user_dashboard(user_uuid UUID)
RETURNS TABLE (
    user_type TEXT,
    total_bookings BIGINT,
    active_bookings BIGINT,
    completed_bookings BIGINT,
    total_spent DECIMAL,
    unread_notifications BIGINT,
    provider_stats JSON
) AS $$
DECLARE
    user_type_val TEXT;
BEGIN
    -- Get user type
    SELECT u.user_type INTO user_type_val
    FROM users u
    WHERE u.id = user_uuid;

    RETURN QUERY
    SELECT 
        user_type_val,
        COUNT(b.id) as total_bookings,
        COUNT(CASE WHEN b.status IN ('pending', 'confirmed', 'in_progress') THEN 1 END) as active_bookings,
        COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
        COALESCE(SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END), 0) as total_spent,
        COUNT(n.id) as unread_notifications,
        CASE 
            WHEN user_type_val = 'provider' THEN
                (SELECT json_build_object(
                    'total_earnings', COALESCE(SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END), 0),
                    'avg_rating', COALESCE(AVG(r.rating), 0),
                    'total_reviews', COUNT(r.id)
                )
                FROM providers p
                LEFT JOIN bookings b ON p.id = b.provider_id
                LEFT JOIN reviews r ON p.id = r.provider_id
                WHERE p.user_id = user_uuid)
            ELSE '{}'::json
        END as provider_stats
    FROM users u
    LEFT JOIN bookings b ON (
        CASE 
            WHEN user_type_val = 'customer' THEN b.customer_id = user_uuid
            WHEN user_type_val = 'provider' THEN b.provider_id IN (SELECT id FROM providers WHERE user_id = user_uuid)
        END
    )
    LEFT JOIN notifications n ON n.user_id = user_uuid AND n.is_read = false
    WHERE u.id = user_uuid
    GROUP BY u.id, user_type_val;
END;
$$ LANGUAGE plpgsql;

-- Function to create booking with automatic calculations
CREATE OR REPLACE FUNCTION create_booking_with_calculations(
    p_customer_id UUID,
    p_provider_id UUID,
    p_service_category_id UUID,
    p_booking_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_notes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_hourly_rate DECIMAL;
    v_duration_hours DECIMAL;
    v_total_amount DECIMAL;
    v_booking_id UUID;
BEGIN
    -- Get provider's hourly rate
    SELECT hourly_rate INTO v_hourly_rate
    FROM providers
    WHERE id = p_provider_id;

    IF v_hourly_rate IS NULL THEN
        RAISE EXCEPTION 'Provider not found or hourly rate not set';
    END IF;

    -- Calculate duration in hours
    v_duration_hours := EXTRACT(EPOCH FROM (p_end_time - p_start_time)) / 3600;
    
    -- Calculate total amount
    v_total_amount := v_hourly_rate * v_duration_hours;

    -- Create booking
    INSERT INTO bookings (
        customer_id,
        provider_id,
        service_category_id,
        booking_date,
        start_time,
        end_time,
        total_amount,
        notes,
        status
    ) VALUES (
        p_customer_id,
        p_provider_id,
        p_service_category_id,
        p_booking_date,
        p_start_time,
        p_end_time,
        v_total_amount,
        p_notes,
        'pending'
    ) RETURNING id INTO v_booking_id;

    -- Create notification for provider
    INSERT INTO notifications (
        user_id,
        title,
        message,
        type
    ) VALUES (
        (SELECT user_id FROM providers WHERE id = p_provider_id),
        'New Booking Request',
        format('You have a new booking request for %s', p_booking_date),
        'booking_request'
    );

    RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update booking status with notifications
CREATE OR REPLACE FUNCTION update_booking_status(
    p_booking_id UUID,
    p_new_status TEXT,
    p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_booking RECORD;
    v_notification_title TEXT;
    v_notification_message TEXT;
BEGIN
    -- Get booking details
    SELECT * INTO v_booking
    FROM bookings
    WHERE id = p_booking_id;

    IF v_booking IS NULL THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    -- Check permissions
    IF v_booking.customer_id != p_user_id AND 
       v_booking.provider_id NOT IN (SELECT id FROM providers WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Update booking status
    UPDATE bookings
    SET status = p_new_status,
        updated_at = NOW()
    WHERE id = p_booking_id;

    -- Create appropriate notification
    CASE p_new_status
        WHEN 'confirmed' THEN
            v_notification_title := 'Booking Confirmed';
            v_notification_message := format('Your booking for %s has been confirmed', v_booking.booking_date);
        WHEN 'cancelled' THEN
            v_notification_title := 'Booking Cancelled';
            v_notification_message := format('Your booking for %s has been cancelled', v_booking.booking_date);
        WHEN 'completed' THEN
            v_notification_title := 'Service Completed';
            v_notification_message := format('Your service for %s has been completed', v_booking.booking_date);
        ELSE
            v_notification_title := 'Booking Updated';
            v_notification_message := format('Your booking status has been updated to %s', p_new_status);
    END CASE;

    -- Send notification to customer
    INSERT INTO notifications (
        user_id,
        title,
        message,
        type
    ) VALUES (
        v_booking.customer_id,
        v_notification_title,
        v_notification_message,
        'booking_update'
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update user's updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at
    BEFORE UPDATE ON providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


