"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { TRAILS } from "@/lib/trails";
import Link from "next/link";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [filteredTrails, setFilteredTrails] = useState<typeof TRAILS>([]);

  useEffect(() => {
    const q = searchParams.get("query") || "";
    setQuery(q);
    setFilteredTrails(
      TRAILS.filter((trail) =>
        trail.name.toLowerCase().includes(q.toLowerCase())
      )
    );
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

      <h1 className="text-3xl font-bold">
        Search results for “{query || "All Trails"}”
      </h1>

      {filteredTrails.length === 0 ? (
        <p className="text-gray-600 mt-4">No trails found.</p>
      ) : (
        <div className="mt-8 grid gap-6 w-full max-w-3xl">
          {filteredTrails.map((trail) => (
            <Link
            key={trail.id}
            href={`/trail/${trail.id}?query=${encodeURIComponent(query)}`}
            className="block border rounded-2xl shadow-sm hover:shadow-lg transition p-4 text-green-600"
            >
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div>
                <h2 className="text-xl font-semibold text-white">{trail.name}</h2>
                <p className="text-gray-500">{trail.description}</p>
                </div>
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
