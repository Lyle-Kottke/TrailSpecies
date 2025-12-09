

import TrailsList from "@/components/customTrailsList";
import { getAllCustomTrails } from "@/utils/supabase/getUserCustomTrails";

export default async function Community_Trails() {

  const trails = await getAllCustomTrails();

  return (

    <div className="flex flex-col items-center p-8 space-y-6">
      <h1 className="text-xl font-bold mb-4">Community Trails</h1>
      <TrailsList trails={trails} baseHref="/trail" previous_page="/community_trails" />
    </div>
  );
}
