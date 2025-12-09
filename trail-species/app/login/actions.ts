'use server'

import { createClient } from '@/utils/supabase/server'


export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()
  //logout before login to clear any existing session
  await supabase.auth.signOut()

  const { email, password } = Object.fromEntries(formData)

  const { error } = await supabase.auth.signInWithPassword({ email: email as string, password: password as string })

  if (error) {
    return { error: 'Incorrect email or password', success: false }
  }

  return { error: null, success: true } 
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
