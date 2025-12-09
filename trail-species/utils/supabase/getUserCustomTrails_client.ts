import { createClient } from "@/utils/supabase/client";

export async function getCustomTrailById(id: string) {
  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from("custom_trails")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching trail by Id", error);
    return null;
  }

  return data
}