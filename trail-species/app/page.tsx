"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
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
      style={{ backgroundColor: "#0a0a0a" }}
    >
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

      {/* FILTERS SECTION */}
      <div className="w-full max-w-xl mt-8 text-gray-200">
        <h2 className="text-xl font-semibold mb-2">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Include Section */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
            <h3 className="font-medium mb-2 text-green-400">Include Species</h3>
            <div className="flex flex-wrap gap-2">
              {SPECIES.map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => toggleInclude(sp)}
                  className={`px-3 py-1 rounded-full border transition ${
                    includeSpecies.includes(sp)
                      ? "bg-green-700 border-green-500"
                      : "bg-zinc-800 border-zinc-600 hover:bg-zinc-700"
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Exclude Section */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
            <h3 className="font-medium mb-2 text-red-400">Exclude Species</h3>
            <div className="flex flex-wrap gap-2">
              {SPECIES.map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => toggleExclude(sp)}
                  className={`px-3 py-1 rounded-full border transition ${
                    excludeSpecies.includes(sp)
                      ? "bg-red-700 border-red-500"
                      : "bg-zinc-800 border-zinc-600 hover:bg-zinc-700"
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 text-sm text-gray-400">
          <p>Including: {includeSpecies.join(", ") || "none"}</p>
          <p>Excluding: {excludeSpecies.join(", ") || "none"}</p>
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