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
        if (path === 'send') {
          return await sendNotification(supabaseClient, user, await req.json())
        }
        break

      case 'GET':
        if (path === 'list') {
          return await getNotifications(supabaseClient, user, url.searchParams)
        }
        if (path === 'unread-count') {
          return await getUnreadCount(supabaseClient, user)
        }
        break

      case 'PUT':
        if (path === 'mark-read') {
          return await markAsRead(supabaseClient, user, await req.json())
        }
        break

      case 'DELETE':
        if (path === 'delete') {
          return await deleteNotification(supabaseClient, user, url.searchParams.get('id'))
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

async function sendNotification(supabaseClient: any, user: any, notificationData: any) {
  const { user_id, title, message, type = 'info' } = notificationData

  // Validate required fields
  if (!user_id || !title || !message) {
    throw new Error('User ID, title, and message are required')
  }

  // Check if user has permission to send notifications (admin or system)
  const { data: currentUser } = await supabaseClient
    .from('users')
    .select('user_type')
    .eq('id', user.id)
    .single()

  if (currentUser?.user_type !== 'admin' && user.id !== user_id) {
    throw new Error('Permission denied')
  }

  // Create notification
  const { data: notification, error } = await supabaseClient
    .from('notifications')
    .insert([
      {
        user_id,
        title,
        message,
        type,
        is_read: false
      }
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      message: 'Notification sent successfully',
      notification 
    }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function getNotifications(supabaseClient: any, user: any, params: URLSearchParams) {
  const limit = parseInt(params.get('limit') || '50')
  const offset = parseInt(params.get('offset') || '0')
  const unreadOnly = params.get('unread') === 'true'

  let query = supabaseClient
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  const { data: notifications, error } = await query

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ notifications }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function getUnreadCount(supabaseClient: any, user: any) {
  const { count, error } = await supabaseClient
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ unread_count: count }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function markAsRead(supabaseClient: any, user: any, data: any) {
  const { notification_id, mark_all = false } = data

  if (!mark_all && !notification_id) {
    throw new Error('Notification ID is required when not marking all as read')
  }

  let query = supabaseClient
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)

  if (!mark_all) {
    query = query.eq('id', notification_id)
  }

  const { error } = await query

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      message: mark_all ? 'All notifications marked as read' : 'Notification marked as read'
    }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function deleteNotification(supabaseClient: any, user: any, notificationId: string) {
  if (!notificationId) {
    throw new Error('Notification ID is required')
  }

  // Check if user owns this notification
  const { data: notification } = await supabaseClient
    .from('notifications')
    .select('id')
    .eq('id', notificationId)
    .eq('user_id', user.id)
    .single()

  if (!notification) {
    throw new Error('Notification not found or access denied')
  }

  const { error } = await supabaseClient
    .from('notifications')
    .delete()
    .eq('id', notificationId)

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({ 
      message: 'Notification deleted successfully'
    }),
    { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}
