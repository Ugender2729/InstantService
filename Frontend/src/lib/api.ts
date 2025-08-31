import { supabase } from './supabase'

// Types
export interface BookingData {
  provider_id: string
  service_category_id?: string
  booking_date: string
  start_time: string
  end_time: string
  notes?: string
}

export interface ProviderData {
  business_name: string
  description?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  latitude?: number
  longitude?: number
  hourly_rate: number
}

export interface NotificationData {
  user_id: string
  title: string
  message: string
  type?: string
}

// API Client Class
export class ApiClient {
  // Authentication
  static async signUp(email: string, password: string, fullName: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone
        }
      }
    })
    
    if (error) throw error
    return data
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // User Profile
  static async createUserProfile(profileData: { full_name: string; phone?: string; user_type?: string }) {
    const { data, error } = await supabase.functions.invoke('auth-callback', {
      body: profileData
    })
    
    if (error) throw error
    return data
  }

  static async getUserProfile() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  }

  static async updateUserProfile(updates: Partial<{ full_name: string; phone: string; avatar_url: string }>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Service Categories
  static async getServiceCategories() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  }

  // Provider Services
  static async registerProvider(providerData: ProviderData) {
    const { data, error } = await supabase.functions.invoke('provider-service/register', {
      body: providerData
    })
    
    if (error) throw error
    return data
  }

  static async getProviderProfile() {
    const { data, error } = await supabase.functions.invoke('provider-service/profile')
    
    if (error) throw error
    return data
  }

  static async updateProviderProfile(updates: Partial<ProviderData & { is_available: boolean }>) {
    const { data, error } = await supabase.functions.invoke('provider-service/update', {
      body: updates
    })
    
    if (error) throw error
    return data
  }

  static async getProviders(filters?: { category?: string; city?: string; verified?: boolean }) {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.city) params.append('city', filters.city)
    if (filters?.verified) params.append('verified', filters.verified.toString())

    const { data, error } = await supabase.functions.invoke(`provider-service/list?${params.toString()}`)
    
    if (error) throw error
    return data
  }

  static async searchProviders(query: string, location?: { lat: number; lng: number; radius?: number }) {
    const params = new URLSearchParams({ q: query })
    if (location) {
      params.append('lat', location.lat.toString())
      params.append('lng', location.lng.toString())
      if (location.radius) params.append('radius', location.radius.toString())
    }

    const { data, error } = await supabase.functions.invoke(`provider-service/search?${params.toString()}`)
    
    if (error) throw error
    return data
  }

  static async addProviderService(categoryId: string) {
    const { data, error } = await supabase.functions.invoke('provider-service/add-service', {
      body: { category_id: categoryId }
    })
    
    if (error) throw error
    return data
  }

  static async removeProviderService(serviceId: string) {
    const { data, error } = await supabase.functions.invoke(`provider-service/remove-service?service_id=${serviceId}`, {
      method: 'DELETE'
    })
    
    if (error) throw error
    return data
  }

  // Booking Services
  static async createBooking(bookingData: BookingData) {
    const { data, error } = await supabase.functions.invoke('booking-service/create', {
      body: bookingData
    })
    
    if (error) throw error
    return data
  }

  static async getBookings(userType: 'customer' | 'provider' = 'customer', status?: string) {
    const params = new URLSearchParams({ user_type: userType })
    if (status) params.append('status', status)

    const { data, error } = await supabase.functions.invoke(`booking-service/list?${params.toString()}`)
    
    if (error) throw error
    return data
  }

  static async getBookingDetails(bookingId: string) {
    const { data, error } = await supabase.functions.invoke(`booking-service/details?id=${bookingId}`)
    
    if (error) throw error
    return data
  }

  static async updateBooking(bookingId: string, updates: { status?: string; notes?: string }) {
    const { data, error } = await supabase.functions.invoke('booking-service/update', {
      body: { id: bookingId, ...updates }
    })
    
    if (error) throw error
    return data
  }

  static async cancelBooking(bookingId: string) {
    const { data, error } = await supabase.functions.invoke(`booking-service/cancel?id=${bookingId}`, {
      method: 'DELETE'
    })
    
    if (error) throw error
    return data
  }

  // Reviews
  static async createReview(reviewData: {
    booking_id: string
    provider_id: string
    rating: number
    comment?: string
  }) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getProviderReviews(providerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users(full_name, avatar_url)
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Notifications
  static async getNotifications(limit = 50, offset = 0, unreadOnly = false) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      unread: unreadOnly.toString()
    })

    const { data, error } = await supabase.functions.invoke(`notification-service/list?${params.toString()}`)
    
    if (error) throw error
    return data
  }

  static async getUnreadNotificationCount() {
    const { data, error } = await supabase.functions.invoke('notification-service/unread-count')
    
    if (error) throw error
    return data
  }

  static async markNotificationAsRead(notificationId?: string, markAll = false) {
    const { data, error } = await supabase.functions.invoke('notification-service/mark-read', {
      body: { notification_id: notificationId, mark_all: markAll }
    })
    
    if (error) throw error
    return data
  }

  static async deleteNotification(notificationId: string) {
    const { data, error } = await supabase.functions.invoke(`notification-service/delete?id=${notificationId}`, {
      method: 'DELETE'
    })
    
    if (error) throw error
    return data
  }

  static async sendNotification(notificationData: NotificationData) {
    const { data, error } = await supabase.functions.invoke('notification-service/send', {
      body: notificationData
    })
    
    if (error) throw error
    return data
  }

  // Database Functions
  static async searchProvidersNearby(lat: number, lng: number, radius = 50, category?: string) {
    const { data, error } = await supabase.rpc('search_providers_nearby', {
      search_lat: lat,
      search_lon: lng,
      search_radius: radius,
      service_category_name: category
    })
    
    if (error) throw error
    return data
  }

  static async getProviderStats(providerId: string) {
    const { data, error } = await supabase.rpc('get_provider_stats', {
      provider_uuid: providerId
    })
    
    if (error) throw error
    return data
  }

  static async getUserDashboard() {
    const { data, error } = await supabase.rpc('get_user_dashboard', {
      user_uuid: (await this.getCurrentUser())?.id
    })
    
    if (error) throw error
    return data
  }

  static async createBookingWithCalculations(bookingData: BookingData) {
    const { data, error } = await supabase.rpc('create_booking_with_calculations', {
      p_customer_id: (await this.getCurrentUser())?.id,
      p_provider_id: bookingData.provider_id,
      p_service_category_id: bookingData.service_category_id,
      p_booking_date: bookingData.booking_date,
      p_start_time: bookingData.start_time,
      p_end_time: bookingData.end_time,
      p_notes: bookingData.notes
    })
    
    if (error) throw error
    return data
  }

  static async updateBookingStatus(bookingId: string, newStatus: string) {
    const { data, error } = await supabase.rpc('update_booking_status', {
      p_booking_id: bookingId,
      p_new_status: newStatus,
      p_user_id: (await this.getCurrentUser())?.id
    })
    
    if (error) throw error
    return data
  }

  // Real-time subscriptions
  static subscribeToBookings(callback: (payload: any) => void) {
    return supabase
      .channel('bookings')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, callback)
      .subscribe()
  }

  static subscribeToNotifications(callback: (payload: any) => void) {
    return supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications'
      }, callback)
      .subscribe()
  }

  static subscribeToProviderUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('providers')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'providers'
      }, callback)
      .subscribe()
  }
}

// Export default instance
export default ApiClient


