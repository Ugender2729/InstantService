# Supabase Backend for InstantService

This document describes the complete backend implementation using Supabase for the InstantService application.

## 🏗️ Architecture Overview

The backend is built entirely on Supabase, providing:

- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Built-in auth with JWT tokens
- **API**: Edge Functions for custom business logic
- **Real-time**: WebSocket subscriptions for live updates
- **Storage**: File storage for images and documents
- **Database Functions**: PostgreSQL functions for complex operations

## 📊 Database Schema

### Core Tables

1. **users** - User accounts and profiles
2. **service_categories** - Available service types
3. **providers** - Service provider profiles
4. **provider_services** - Many-to-many relationship
5. **bookings** - Service booking records
6. **reviews** - Customer reviews and ratings
7. **notifications** - User notifications

### Relationships

```
users (1) ←→ (1) providers
users (1) ←→ (∞) bookings (as customer)
providers (1) ←→ (∞) bookings (as provider)
providers (∞) ←→ (∞) service_categories (via provider_services)
bookings (1) ←→ (1) reviews
users (1) ←→ (∞) notifications
```

## 🔐 Authentication & Authorization

### User Types
- **customer** - Service consumers
- **provider** - Service providers
- **admin** - System administrators

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Public read access for service categories
- Provider visibility based on availability
- Booking access for involved parties only

## 🚀 Edge Functions

### 1. auth-callback
**Purpose**: Handle user registration and profile creation

**Endpoints**:
- `POST /functions/v1/auth-callback` - Create user profile

**Usage**:
```typescript
await ApiClient.createUserProfile({
  full_name: "John Doe",
  phone: "+1234567890",
  user_type: "customer"
})
```

### 2. booking-service
**Purpose**: Manage booking lifecycle

**Endpoints**:
- `POST /functions/v1/booking-service/create` - Create new booking
- `GET /functions/v1/booking-service/list` - Get user bookings
- `GET /functions/v1/booking-service/details` - Get booking details
- `PUT /functions/v1/booking-service/update` - Update booking
- `DELETE /functions/v1/booking-service/cancel` - Cancel booking

**Usage**:
```typescript
// Create booking
await ApiClient.createBooking({
  provider_id: "uuid",
  service_category_id: "uuid",
  booking_date: "2024-12-15",
  start_time: "09:00",
  end_time: "11:00",
  notes: "Leaky faucet"
})

// Get bookings
await ApiClient.getBookings('customer', 'pending')
```

### 3. provider-service
**Purpose**: Manage provider profiles and services

**Endpoints**:
- `POST /functions/v1/provider-service/register` - Register as provider
- `GET /functions/v1/provider-service/profile` - Get provider profile
- `PUT /functions/v1/provider-service/update` - Update provider profile
- `GET /functions/v1/provider-service/list` - List providers
- `GET /functions/v1/provider-service/search` - Search providers
- `POST /functions/v1/provider-service/add-service` - Add service
- `DELETE /functions/v1/provider-service/remove-service` - Remove service

**Usage**:
```typescript
// Register as provider
await ApiClient.registerProvider({
  business_name: "Mike's Plumbing Co",
  description: "Professional plumbing services",
  address: "123 Main St",
  city: "New York",
  state: "NY",
  hourly_rate: 75.00
})

// Search providers
await ApiClient.searchProviders("plumbing", {
  lat: 40.7128,
  lng: -74.0060,
  radius: 25
})
```

### 4. notification-service
**Purpose**: Manage user notifications

**Endpoints**:
- `POST /functions/v1/notification-service/send` - Send notification
- `GET /functions/v1/notification-service/list` - Get notifications
- `GET /functions/v1/notification-service/unread-count` - Get unread count
- `PUT /functions/v1/notification-service/mark-read` - Mark as read
- `DELETE /functions/v1/notification-service/delete` - Delete notification

**Usage**:
```typescript
// Get notifications
await ApiClient.getNotifications(50, 0, true) // unread only

// Mark as read
await ApiClient.markNotificationAsRead("notification-id")
```

## 🗄️ Database Functions

### 1. search_providers_nearby
**Purpose**: Find providers within a radius with optional service filtering

**Parameters**:
- `search_lat` - Latitude
- `search_lon` - Longitude
- `search_radius` - Search radius in km (default: 50)
- `service_category_name` - Optional service filter

**Usage**:
```typescript
await ApiClient.searchProvidersNearby(40.7128, -74.0060, 25, "Plumbing")
```

### 2. get_provider_stats
**Purpose**: Get comprehensive statistics for a provider

**Returns**:
- Total bookings
- Completed bookings
- Cancelled bookings
- Total earnings
- Average rating
- Total reviews

**Usage**:
```typescript
await ApiClient.getProviderStats("provider-uuid")
```

### 3. get_user_dashboard
**Purpose**: Get dashboard data for the current user

**Returns**:
- User type
- Booking statistics
- Spending/earnings
- Unread notifications
- Provider-specific stats

**Usage**:
```typescript
await ApiClient.getUserDashboard()
```

### 4. create_booking_with_calculations
**Purpose**: Create booking with automatic price calculation

**Features**:
- Automatic duration calculation
- Price calculation based on hourly rate
- Automatic notification creation
- Transaction safety

**Usage**:
```typescript
await ApiClient.createBookingWithCalculations({
  provider_id: "uuid",
  booking_date: "2024-12-15",
  start_time: "09:00",
  end_time: "11:00"
})
```

### 5. update_booking_status
**Purpose**: Update booking status with automatic notifications

**Features**:
- Permission checking
- Automatic notification creation
- Status-specific messages

**Usage**:
```typescript
await ApiClient.updateBookingStatus("booking-id", "confirmed")
```

## 🔄 Real-time Features

### Subscriptions
The backend supports real-time subscriptions for:

1. **Bookings** - Live booking updates
2. **Notifications** - Instant notification delivery
3. **Provider Updates** - Provider availability changes

**Usage**:
```typescript
// Subscribe to booking updates
ApiClient.subscribeToBookings((payload) => {
  console.log('Booking updated:', payload)
})

// Subscribe to notifications
ApiClient.subscribeToNotifications((payload) => {
  console.log('New notification:', payload)
})
```

## 🛡️ Security Features

### Row Level Security (RLS)
All tables have RLS policies ensuring:

- **Users table**: Users can only view/update their own profile
- **Providers table**: Public read for available providers, owners can update
- **Bookings table**: Only involved parties (customer/provider) can access
- **Reviews table**: Public read, authenticated write
- **Notifications table**: Users can only access their own notifications

### Authentication
- JWT-based authentication
- Automatic token refresh
- Secure password handling
- Email verification (optional)

### Data Validation
- Input validation in Edge Functions
- Database constraints
- Type safety with TypeScript

## 📈 Performance Optimizations

### Indexes
- Email indexes for fast user lookup
- Location indexes for provider search
- Date indexes for booking queries
- Composite indexes for common queries

### Query Optimization
- Efficient joins with proper indexing
- Pagination for large datasets
- Selective field loading
- Caching strategies

## 🚀 Deployment

### Local Development
```bash
# Start Supabase locally
npm run supabase:start

# Deploy functions
npx supabase functions deploy

# Reset database
npm run supabase:reset
```

### Production Deployment
```bash
# Link to production project
npx supabase link --project-ref your-project-ref

# Deploy all functions
npx supabase functions deploy

# Push database changes
npx supabase db push
```

## 📝 API Documentation

### Authentication Endpoints
```typescript
// Sign up
await ApiClient.signUp(email, password, fullName, phone)

// Sign in
await ApiClient.signIn(email, password)

// Sign out
await ApiClient.signOut()

// Get current user
await ApiClient.getCurrentUser()
```

### Provider Endpoints
```typescript
// Register as provider
await ApiClient.registerProvider(providerData)

// Get provider profile
await ApiClient.getProviderProfile()

// Update provider profile
await ApiClient.updateProviderProfile(updates)

// Search providers
await ApiClient.searchProviders(query, location)
```

### Booking Endpoints
```typescript
// Create booking
await ApiClient.createBooking(bookingData)

// Get bookings
await ApiClient.getBookings('customer', 'pending')

// Update booking
await ApiClient.updateBooking(bookingId, updates)

// Cancel booking
await ApiClient.cancelBooking(bookingId)
```

### Notification Endpoints
```typescript
// Get notifications
await ApiClient.getNotifications(limit, offset, unreadOnly)

// Mark as read
await ApiClient.markNotificationAsRead(notificationId)

// Get unread count
await ApiClient.getUnreadNotificationCount()
```

## 🔧 Configuration

### Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-anon-key

# Production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Database Configuration
- PostgreSQL 17
- Row Level Security enabled
- Automatic backups
- Connection pooling

## 🧪 Testing

### Edge Function Testing
```bash
# Test functions locally
npx supabase functions serve

# Test specific function
curl -X POST http://localhost:54321/functions/v1/auth-callback \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","phone":"+1234567890"}'
```

### Database Testing
```bash
# Reset database
npm run supabase:reset

# Run migrations
npx supabase db reset

# Test database functions
npx supabase db studio
```

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🎯 Next Steps

1. **Payment Integration**: Add Stripe/PayPal integration
2. **File Storage**: Implement image upload for providers
3. **Email Templates**: Configure email notifications
4. **Analytics**: Add usage analytics and reporting
5. **Mobile App**: Create React Native app with same backend
6. **Admin Panel**: Build admin dashboard for management


