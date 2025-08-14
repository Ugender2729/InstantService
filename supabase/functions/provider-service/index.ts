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
        if (path === 'register') {
          return await registerProvider(supabaseClient, user, await req.json())
        }
        if (path === 'add-service') {
          return await addService(supabaseClient, user, await req.json())
        }
        break

      case 'GET':
        if (path === 'profile') {
          return await getProviderProfile(supabaseClient, user)
        }
        if (path === 'list') {
          return await getProviders(supabaseClient, url.searchParams)
        }
        if (path === 'search') {
          return await searchProviders(supabaseClient, url.searchParams)
        }
        break

      case 'PUT':
        if (path === 'update') {
          return await updateProvider(supabaseClient, user, await req.json())
        }
        break

      case 'DELETE':
        if (path === 'remove-service') {
          return await removeService(supabaseClient, user, url.searchParams.get('service_id'))
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

async function registerProvider(supabaseClient: any, user: any, providerData: any) {
  const { 
    business_name, 
    description, 
    address, 
    city, 
    state, 
    zip_code, 
    latitude, 
    longitude, 
    hourly_rate 
  } = providerData

  // Validate required fields
  if (!business_name || !hourly_rate) {
    throw new Error('Business name and hourly rate are required')
  }

  // Check if user is already a provider
  const { data: existingProvider } = await supabaseClient
    .from('providers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existingProvider) {
    throw new Error('User is already registered as a provider')
  }

  // Create provider profile
  const { data: provider, error } = await supabaseClient
    .from('providers')
    .insert([
      {
        user_id: user.id,
        business_name,
        description,
        address,
        city,
        state,
        zip_code,
        latitude,
        longitude,
        hourly_rate,
        is_verified: false,
        is_available: true
      }
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  // Update user type to provider
  await supabaseClient
    .from('users')
    .update({ user_type: 'provider' })
    .eq('id', user.id)

  return new Response(
    JSON.stringify({ 
      message: 'Provider registered successfully',
      provider 
    }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function getProviderProfile(supabaseClient: any, user: any) {
  const { data: provider, error } = await supabaseClient
    .from('providers')
    .select(`
      *,
      users(full_name, email, phone),
      provider_services(
        service_categories(id, name, description)
      )
    `)
    .eq('user_id', user.id)
    .single()

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ provider }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function getProviders(supabaseClient: any, params: URLSearchParams) {
  const category = params.get('category')
  const city = params.get('city')
  const verified = params.get('verified')

  let query = supabaseClient
    .from('providers')
    .select(`
      *,
      users(full_name, email),
      provider_services(
        service_categories(id, name)
      )
    `)
    .eq('is_available', true)

  if (category) {
    query = query.eq('provider_services.service_categories.name', category)
  }

  if (city) {
    query = query.ilike('city', `%${city}%`)
  }

  if (verified === 'true') {
    query = query.eq('is_verified', true)
  }

  const { data: providers, error } = await query.order('business_name')

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ providers }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function searchProviders(supabaseClient: any, params: URLSearchParams) {
  const query = params.get('q')
  const lat = params.get('lat')
  const lng = params.get('lng')
  const radius = params.get('radius') || '50' // km

  if (!query) {
    throw new Error('Search query is required')
  }

  let sqlQuery = `
    SELECT 
      p.*,
      u.full_name,
      u.email,
      ps.service_categories
    FROM providers p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN (
      SELECT 
        ps.provider_id,
        json_agg(sc.name) as service_categories
      FROM provider_services ps
      JOIN service_categories sc ON ps.category_id = sc.id
      GROUP BY ps.provider_id
    ) ps ON p.id = ps.provider_id
    WHERE p.is_available = true
    AND (
      p.business_name ILIKE $1 
      OR p.description ILIKE $1
      OR u.full_name ILIKE $1
    )
  `

  const searchTerm = `%${query}%`
  const queryParams = [searchTerm]

  // Add location-based search if coordinates provided
  if (lat && lng) {
    sqlQuery += `
      AND (
        6371 * acos(
          cos(radians($2)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians($3)) + 
          sin(radians($2)) * sin(radians(p.latitude))
        )
      ) <= $4
    `
    queryParams.push(parseFloat(lat), parseFloat(lng), parseFloat(radius))
  }

  sqlQuery += ' ORDER BY p.business_name'

  const { data: providers, error } = await supabaseClient.rpc('exec_sql', {
    sql: sqlQuery,
    params: queryParams
  })

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ providers }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function updateProvider(supabaseClient: any, user: any, updateData: any) {
  const { 
    business_name, 
    description, 
    address, 
    city, 
    state, 
    zip_code, 
    latitude, 
    longitude, 
    hourly_rate,
    is_available 
  } = updateData

  // Get provider to check ownership
  const { data: provider } = await supabaseClient
    .from('providers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!provider) {
    throw new Error('Provider profile not found')
  }

  const updateFields: any = {}
  if (business_name) updateFields.business_name = business_name
  if (description) updateFields.description = description
  if (address) updateFields.address = address
  if (city) updateFields.city = city
  if (state) updateFields.state = state
  if (zip_code) updateFields.zip_code = zip_code
  if (latitude) updateFields.latitude = latitude
  if (longitude) updateFields.longitude = longitude
  if (hourly_rate) updateFields.hourly_rate = hourly_rate
  if (is_available !== undefined) updateFields.is_available = is_available

  const { data: updatedProvider, error } = await supabaseClient
    .from('providers')
    .update(updateFields)
    .eq('id', provider.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      message: 'Provider profile updated successfully',
      provider: updatedProvider 
    }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function addService(supabaseClient: any, user: any, serviceData: any) {
  const { category_id } = serviceData

  if (!category_id) {
    throw new Error('Category ID is required')
  }

  // Get provider ID
  const { data: provider } = await supabaseClient
    .from('providers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!provider) {
    throw new Error('Provider profile not found')
  }

  // Check if service already exists
  const { data: existingService } = await supabaseClient
    .from('provider_services')
    .select('id')
    .eq('provider_id', provider.id)
    .eq('category_id', category_id)
    .single()

  if (existingService) {
    throw new Error('Service already added')
  }

  // Add service
  const { data: service, error } = await supabaseClient
    .from('provider_services')
    .insert([
      {
        provider_id: provider.id,
        category_id
      }
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      message: 'Service added successfully',
      service 
    }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function removeService(supabaseClient: any, user: any, serviceId: string) {
  if (!serviceId) {
    throw new Error('Service ID is required')
  }

  // Get provider ID
  const { data: provider } = await supabaseClient
    .from('providers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!provider) {
    throw new Error('Provider profile not found')
  }

  // Delete service
  const { error } = await supabaseClient
    .from('provider_services')
    .delete()
    .eq('id', serviceId)
    .eq('provider_id', provider.id)

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      message: 'Service removed successfully'
    }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}
