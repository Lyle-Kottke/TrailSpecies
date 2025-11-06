import { redirect } from 'next/navigation'
// Since you're calling Supabase from a Server Component, use the client created in @/utils/supabase/server.ts.

import { createClient } from '@/utils/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <p>Hello {data.user.email}</p>
}