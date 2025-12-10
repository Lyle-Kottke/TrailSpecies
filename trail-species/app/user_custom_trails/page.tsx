import TrailsList from "@/components/customTrailsList";
import { getUser } from "@/utils/supabase/getUser"
import { getUserCustomTrails } from "@/utils/supabase/getUserCustomTrails";

// user trails created by logged-in user
export default async function User_Custom_Trails() {
  const user = await getUser();

  const trails = user ? await getUserCustomTrails(user.id) : [];
  console.log("USER",user)
  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      <h1 className="text-xl font-bold mb-4">My Custom Trails</h1>
      <TrailsList trails={trails}  baseHref="/trail" previous_page="/user_custom_trails" />
    </div>
  );
}
