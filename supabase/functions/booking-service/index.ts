// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    switch (method) {
      case 'POST':
        if (path === 'create') {
          return await createBooking(supabaseClient, user, await req.json())
        }
        break

      case 'GET':
        if (path === 'list') {
          return await getBookings(supabaseClient, user, url.searchParams)
        }
        if (path === 'details') {
          return await getBookingDetails(supabaseClient, user, url.searchParams.get('id'))
        }
        break

      case 'PUT':
        if (path === 'update') {
          return await updateBooking(supabaseClient, user, await req.json())
        }
        break

      case 'DELETE':
        if (path === 'cancel') {
          return await cancelBooking(supabaseClient, user, url.searchParams.get('id'))
        }
        break

      default:
        throw new Error(`Method ${method} not allowed`)
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function createBooking(supabaseClient: any, user: any, bookingData: any) {
  const { provider_id, service_category_id, booking_date, start_time, end_time, notes } = bookingData

  // Validate required fields
  if (!provider_id || !booking_date || !start_time || !end_time) {
    throw new Error('Missing required fields')
  }

  // Get provider details to calculate total amount
  const { data: provider } = await supabaseClient
    .from('providers')
    .select('hourly_rate')
    .eq('id', provider_id)
    .single()

  if (!provider) {
    throw new Error('Provider not found')
  }

  // Calculate duration and total amount
  const start = new Date(`2000-01-01T${start_time}`)
  const end = new Date(`2000-01-01T${end_time}`)
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  const total_amount = provider.hourly_rate * durationHours

  // Create booking
  const { data: booking, error } = await supabaseClient
    .from('bookings')
    .insert([
      {
        customer_id: user.id,
        provider_id,
        service_category_id,
        booking_date,
        start_time,
        end_time,
        total_amount,
        notes,
        status: 'pending'
      }
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  // Create notification for provider
  await supabaseClient
    .from('notifications')
    .insert([
      {
        user_id: provider_id,
        title: 'New Booking Request',
        message: `You have a new booking request for ${booking_date}`,
        type: 'booking_request'
      }
    ])

  return new Response(
    JSON.stringify({ 
      message: 'Booking created successfully',
      booking 
    }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function getBookings(supabaseClient: any, user: any, params: URLSearchParams) {
  const userType = params.get('user_type') || 'customer'
  const status = params.get('status')

  let query = supabaseClient
    .from('bookings')
    .select(`
      *,
      providers!inner(business_name, hourly_rate),
      service_categories(name),
      users!inner(full_name, email)
    `)

  if (userType === 'customer') {
    query = query.eq('customer_id', user.id)
  } else if (userType === 'provider') {
    query = query.eq('providers.user_id', user.id)
  }

  if (status) {
    query = query.eq('status', status)
  }

  const { data: bookings, error } = await query.order('booking_date', { ascending: false })

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ bookings }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function getBookingDetails(supabaseClient: any, user: any, bookingId: string) {
  if (!bookingId) {
    throw new Error('Booking ID is required')
  }

  const { data: booking, error } = await supabaseClient
    .from('bookings')
    .select(`
      *,
      providers!inner(business_name, hourly_rate, description),
      service_categories(name),
      users!inner(full_name, email)
    `)
    .eq('id', bookingId)
    .single()

  if (error) {
    throw error
  }

  // Check if user has access to this booking
  if (booking.customer_id !== user.id && booking.providers.user_id !== user.id) {
    throw new Error('Access denied')
  }

  return new Response(
    JSON.stringify({ booking }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function updateBooking(supabaseClient: any, user: any, updateData: any) {
  const { id, status, notes } = updateData

  if (!id) {
    throw new Error('Booking ID is required')
  }

  // Get booking to check permissions
  const { data: booking } = await supabaseClient
    .from('bookings')
    .select('customer_id, providers(user_id)')
    .eq('id', id)
    .single()

  if (!booking) {
    throw new Error('Booking not found')
  }

  // Check if user has permission to update this booking
  if (booking.customer_id !== user.id && booking.providers.user_id !== user.id) {
    throw new Error('Access denied')
  }

  const updateFields: any = {}
  if (status) updateFields.status = status
  if (notes) updateFields.notes = notes

  const { data: updatedBooking, error } = await supabaseClient
    .from('bookings')
    .update(updateFields)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      message: 'Booking updated successfully',
      booking: updatedBooking 
    }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function cancelBooking(supabaseClient: any, user: any, bookingId: string) {
  if (!bookingId) {
    throw new Error('Booking ID is required')
  }

  // Get booking to check permissions
  const { data: booking } = await supabaseClient
    .from('bookings')
    .select('customer_id, providers(user_id), status')
    .eq('id', bookingId)
    .single()

  if (!booking) {
    throw new Error('Booking not found')
  }

  // Check if user has permission to cancel this booking
  if (booking.customer_id !== user.id && booking.providers.user_id !== user.id) {
    throw new Error('Access denied')
  }

  // Check if booking can be cancelled
  if (booking.status === 'completed' || booking.status === 'cancelled') {
    throw new Error('Booking cannot be cancelled')
  }

  const { error } = await supabaseClient
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      message: 'Booking cancelled successfully'
    }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}
