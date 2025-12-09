import { createClient } from "@/utils/supabase/client"

export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error("getUser error:", error)
    return null
  }

  return user
}