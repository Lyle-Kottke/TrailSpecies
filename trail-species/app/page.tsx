"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import SpeciesSearch from "@/components/SpeciesSearch";
import Link from "next/link";

// Predefined species list
const SPECIES = ["bear", "wolf", "deer", "moose", "bird"];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [includeSpecies, setIncludeSpecies] = useState<string[]>([]);
  const [excludeSpecies, setExcludeSpecies] = useState<string[]>([]);

  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
  }, []);

  const toggleInclude = (species: string) => {
    setIncludeSpecies((prev) =>
      prev.includes(species)
        ? prev.filter((s) => s !== species)
        : [...prev, species]
    );
    // Ensure it can't be in exclude simultaneously
    setExcludeSpecies((prev) => prev.filter((s) => s !== species));
  };

  const toggleExclude = (species: string) => {
    setExcludeSpecies((prev) =>
      prev.includes(species)
        ? prev.filter((s) => s !== species)
        : [...prev, species]
    );
    // Ensure it can't be in include simultaneously
    setIncludeSpecies((prev) => prev.filter((s) => s !== species));
  };
  //Function to store taxons selected by user. Each element is the JSON from iNaturalist about the selected taxon
  const handleTaxonSelect = (taxon: any) => {
    setIncludeSpecies(prev => [...prev, taxon]);   // store full taxon or only needed fields
  };
  //Function to remove taxons from the include list when the user hits the 'x' button on them.
  const removeIncludedTaxon = (id: number) => {
    setIncludeSpecies(prev => prev.filter(t => t.id !== id));
  };
  //Function to remove taxons from the exclude list when the user hits the 'x' button on them.
  const removeExcludedTaxon = (id: number) => {
    setExcludeSpecies(prev => prev.filter(t => t.id !== id));
  };
  //Captialize helper
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams({
      query,
      include: includeSpecies.join(","),
      exclude: excludeSpecies.join(","),
    });

    router.push(`/results?${params.toString()}`);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-8"
      style={{ backgroundColor: "#0a0a0a" }}>
      <h1 className="text-5xl font-bold mb-4">Trail Species</h1>

      <p className="text-gray-500 mb-10 text-center max-w-lg">
        Find trails and explore wildlife!
      </p>

      {/* SEARCH BAR */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex items-center space-x-2 bg-white rounded-full shadow-md p-3"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a trail..."
          className="flex-1 px-4 py-2 rounded-full outline-none text-gray-700"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>

      {/*Search by species filters*/}
      <h2 className="text-xl font-semibold mb-2">Filters</h2>  
      {/*Species search bar*/}
      <SpeciesSearch
        onInclude={(taxon) => {
          if (includeSpecies.some(s => s.id === taxon.id)) return; //Logic here to make sure user doesn't add multiple copies of a taxon
          setIncludeSpecies(prev => [...prev, taxon])
          setExcludeSpecies(prev => prev.filter(s=>s.id !== taxon.id)); //If a species that already exists in the opposite box is added to this box, remove it from opposite box
        }}
        onExclude={(taxon) => {
          if (excludeSpecies.some(s => s.id === taxon.id)) return;
          setExcludeSpecies(prev => [...prev, taxon])
          setIncludeSpecies(prev => prev.filter(s=>s.id !== taxon.id)); 
        }}
          
      />
      {/*Tags system */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
  
        {/* Included */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700">
          <div className="text-green-300 font-semibold mb-2">Included Species</div>
          {/*Size of box*/}
          <div className="flex flex-wrap gap-2 min-w-[250px] max-w-md">
            {includeSpecies.map((taxon) => (
              <span
                key={taxon.id}
                className="px-2 py-1 bg-green-800 text-green-100 text-sm rounded-lg flex items-center gap-1"
              >
                {capitalize(taxon.preferred_common_name)} / {capitalize(taxon.name)}
                <button
                  onClick={() => removeIncludedTaxon(taxon.id)}
                  className="text-green-200 hover:text-green-400"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Excluded */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700">
          <div className="text-red-300 font-semibold mb-2">Excluded Species</div>
          {/*Size of box*/}
          <div className="flex flex-wrap gap-2 min-w-[250px] max-w-md">
            {excludeSpecies.map((taxon) => (
              <span
                key={taxon.id}
                className="px-2 py-1 bg-red-800 text-red-100 text-sm rounded-lg flex items-center gap-1"
              >
                {capitalize(taxon.preferred_common_name)} / {capitalize(taxon.name)}
                <button
                  onClick={() => removeExcludedTaxon(taxon.id)}
                  className="text-red-200 hover:text-red-400"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Logged in display */}
      <div className="mt-8 text-gray-500">
        {user ? (
          <h1>Welcome, {user.email}!</h1>
        ) : (
          <h1>Log in if you want to save trails.</h1>
        )}
      </div>

      {/* Custom Trail Button */}
      <button
        onClick={() => router.push("/trail_create")}
        className="mt-10 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
        Create Custom Trail
      </button>
    </div>
  );
}