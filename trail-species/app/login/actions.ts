'use server'

import { createClient } from '@/utils/supabase/server'


export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const { email, password } = Object.fromEntries(formData)

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Incorrect email or password', success: false }
  }

  return { error: null, success: true }  // ⬅️ needed
}


export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: "Could not create account" }
  }

  return { success: true }
}
