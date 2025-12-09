"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import PublicTrailList from "@/components/publicTrailList";
import {saveUserSearch} from "@/utils/supabase/userSavedInfo";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [query, setQuery] = useState("");
  const [includeNames, setIncludeNames] = useState<string[]>([]);
  const [excludeNames, setExcludeNames] = useState<string[]>([]);

  console.log("excludeNames", excludeNames)
  console.log("includeNames", includeNames)

  // const [includeIds, setIncludeIds] = useState<string[]>([]);
  // const [excludeIds, setExcludeIds] = useState<string[]>([]);

  const [filteredTrails, setFilteredTrails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // new example request: /extended_trail_search?current_month=5&include_ids=123,456&exclude_ids=789&trail_name=Blue%20Trail
  // where query items are: 
  // const params = new URLSearchParams({
  //   query,
  //   include: includeSpecies.join(","),
  //   exclude: excludeSpecies.join(","),
  // });

  async function handleUserSearchSave() {
    const res = await saveUserSearch(searchParams.toString())
    alert("Search saved!")
  }

  useEffect(() => {
    const q = searchParams.get("query") || "";
    const currentMonth = new Date().getMonth() + 1;

    const i_params = searchParams.get("include_ids");
    const e_params = searchParams.get("exclude_ids");

    const i_ids = i_params ? i_params.split(",") : [];
    const e_ids = e_params ? e_params.split(",") : [];

    const i_names = (searchParams.get("include_names") || "")
      .split(",")
      .map(decodeURIComponent);
    const e_names = (searchParams.get("exclude_names") || "")
      .split(",")
      .map(decodeURIComponent);

    const extendedSearchParams = new URLSearchParams({
      q: q,
      current_month: currentMonth.toString(),
      include_ids: i_ids.join(","),
      exclude_ids: e_ids.join(","),
    });

    setQuery(q);
    if (i_names.length > 0 && i_names[0] != "") {
      setIncludeNames(i_names);
    }
    if (e_names.length > 0 && e_names[0] != "") {
      setExcludeNames(e_names);
    }
    // setIncludeIds(i_ids);
    // setExcludeIds(e_ids);

    // if (!q) {
    //   setFilteredTrails([]);
    //   return;
    // }

    setLoading(true);
    setError(null);

    console.log(`URL: https://trailgeoapi.onrender.com/extended_trail_search?${extendedSearchParams.toString()}`)
    
    fetch(`https://trailgeoapi.onrender.com/extended_trail_search?${extendedSearchParams.toString()}`)
        .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to fetch trails");
        }
        return res.json();
      })
      .then((data) => {
        // data.results is your array of trails
        const results = data.results || [];

        const uniqueTrails: typeof results = [];
        const seenNames = new Set<string>();
        for (const trail of results) {
          if (!seenNames.has(trail.name)) {
            seenNames.add(trail.name);
            uniqueTrails.push(trail);
          }
        }

        setFilteredTrails(uniqueTrails);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        className="self-start text-green-600 hover:underline"
      >
        ← Back to search
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-center w-full gap-4">
        <h1 className="text-3xl font-bold">
          Search results for "{query || "All Trails"}"
        </h1>
        <button
          onClick={handleUserSearchSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save this Search
        </button>
      </div>
      {includeNames.length > 0 && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700">
          <div className="text-green-300 font-semibold mb-2">Included Species</div>
          {/*Size of box*/}
          <div className="flex flex-wrap gap-2 min-w-[250px] max-w-md">
            {includeNames.map((name) => (
              <span
                key={name}
                className="px-2 py-1 bg-green-800 text-green-100 text-sm rounded-lg flex items-center gap-1"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}  
      {excludeNames.length > 0 && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700">
          <div className="text-red-300 font-semibold mb-2">Excluded Species</div>
          {/*Size of box*/}
          <div className="flex flex-wrap gap-2 min-w-[250px] max-w-md">
            {excludeNames.map((name) => (
              <span
                key={name}
                className="px-2 py-1 bg-red-800 text-red-100 text-sm rounded-lg flex items-center gap-1"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}  
      {loading && <p>Loading trails...</p>}
      {error && <p className="text-red-600">{error}</p>}


      {!loading && !error && filteredTrails.length === 0 ? (
        <p className="text-gray-600 mt-4">No trails found.</p>
      ) : (
        <PublicTrailList
          trails={filteredTrails}
          searchParams={searchParams} // this is the full URLSearchParams object
          baseHref="/trail"
          previous_page="/results"
        />
      )}
    </div>
  );
}
