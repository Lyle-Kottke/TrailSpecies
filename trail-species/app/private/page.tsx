import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
// Template of page private to logged-in users
export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <p>Hello {data.user.email}</p>
}