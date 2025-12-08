// supabase/utils/getCustomTrails.ts
import { createClient } from "@/utils/supabase/server";

export async function getUserCustomTrails(userId: string) {
  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from("custom_trails")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching custom trails:", error);
    return [];
  }

  // features is stored as a JSON *string*, convert it here
  return data.map((t) => ({
    ...t,
    features: typeof t.features === "string"
      ? JSON.parse(t.features)
      : t.features,
  }));
}

export async function getAllCustomTrails() {
  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from("custom_trails")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching all custom trails:", error);
    return [];
  }

  // features is stored as a JSON *string*, convert it here
  return data.map((t) => ({
    ...t,
    features: typeof t.features === "string"
      ? JSON.parse(t.features)
      : t.features,
  }));
}
