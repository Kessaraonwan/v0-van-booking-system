import { createBrowserClient as createClient } from '@supabase/ssr'

let client = null

export function createBrowserClient() {
  if (client) {
    return client
  }

  client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  return client
}
