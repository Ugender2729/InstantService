import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

// Create the main Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create admin client with service role key (for admin operations)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Admin credentials (hardcoded for security)
export const ADMIN_CREDENTIALS = {
  email: 'Ugenderdharavath@gmail.com',
  password: '9398601984'
}

// Function to check if current user is admin
export const isAdmin = (user: any) => {
  return user?.email === ADMIN_CREDENTIALS.email
}

// Function to get admin access
export const getAdminAccess = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Admin login failed:', error)
    return null
  }
}

// Database types (you can generate these with `npx supabase gen types typescript --local`)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          user_type: 'customer' | 'provider' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          user_type?: 'customer' | 'provider' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          user_type?: 'customer' | 'provider' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      service_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
      }
      providers: {
        Row: {
          id: string
          user_id: string
          business_name: string
          description: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          latitude: number | null
          longitude: number | null
          hourly_rate: number | null
          is_verified: boolean
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          description?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          latitude?: number | null
          longitude?: number | null
          hourly_rate?: number | null
          is_verified?: boolean
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          description?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          latitude?: number | null
          longitude?: number | null
          hourly_rate?: number | null
          is_verified?: boolean
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          provider_id: string
          service_category_id: string | null
          booking_date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          total_amount: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          provider_id: string
          service_category_id?: string | null
          booking_date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          total_amount?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          provider_id?: string
          service_category_id?: string | null
          booking_date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          total_amount?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          customer_id: string
          provider_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          customer_id: string
          provider_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          customer_id?: string
          provider_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}

