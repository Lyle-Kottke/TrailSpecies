import TrailsList from "@/components/trailsList";
import { getUser } from "@/utils/supabase/getUser"
import { getUserCustomTrails } from "@/utils/supabase/getUserCustomTrails";

export default async function User_Custom_Trails() {
  const user = await getUser();

  const trails = user ? await getUserCustomTrails(user.id) : [];

  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      <h1 className="text-xl font-bold mb-4">My Custom Trails</h1>
      <TrailsList trails={trails} baseHref="/my-trails" />
    </div>
  );
}
