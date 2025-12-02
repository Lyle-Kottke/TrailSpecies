'use server'

import { createClient } from '@/utils/supabase/server'
import { UUID } from 'crypto'
import { getUser } from "@/utils/supabase/getUser"


export async function addTrailToDatabase(features: any, trail_name: String) {
    const supabase = await createClient()
    const user = await getUser()

    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }
      
    const new_custom_trail = {
      features: features,
      user_id: user.id,
      trail_name: trail_name
    }
    
    const {data, error} = await supabase
    .from("custom_trails")
    .insert(new_custom_trail)
    .select();

    if (error) {
      console.error('Insert error:', error.message);
      return null
    }

    console.log('Data inserted successfully:', data);
    return data
}
