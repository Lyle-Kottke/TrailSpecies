"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import SpeciesPopup from "@/components/SpeciesPopup";
import { TRAILS } from "@/lib/trails";

export default function TrailPage() {
  const params = useParams(); // useParams() hook for dynamic folder values
  const searchParams = useSearchParams(); // query string params
  const id = params.id; // permanentidentifier from [id] folder
  const query = searchParams.get("query") || "";

  const trail = TRAILS.find((t) => t.id === id);
  const [species, setSpecies] = useState<any[] | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<any | null>(null);

  useEffect(() => {
    if (trail) {
      setSpecies([
        {
          id: 1,
          name: "Eastern Chipmunk",
          description:
            "Common forest rodent found in wooded areas of Massachusetts.",
          image: "/images/species/chipmunk.jpg",
        },
        {
          id: 2,
          name: "White-Tailed Deer",
          description:
            "Large herbivore commonly found in MA forests and parks.",
          image: "/images/species/deer.jpg",
        },
        {
          id: 4,
          name: "Red Fox",
          description: "A cunning forest predator with a fiery coat.",
          image: "/images/species/fox.jpg",
        },
      ]);
    }
  }, [trail]);

  if (!trail) return <p className="p-8 text-red-600">Trail not found</p>;

  return (
    <div className="p-8">
      <a
        href={`/results?query=${encodeURIComponent(query)}`}
        className="text-green-600 hover:underline"
      >
        ← Back to results
      </a>

      <h1 className="text-3xl font-bold mt-4">{trail.name}</h1>
      <p className="text-gray-500 mb-6">{trail.description}</p>

      <h2 className="text-2xl font-semibold mb-4">Species Found Here</h2>
      {!species ? (
        <p>Loading species...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {species.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSpecies(s)}
              className="cursor-pointer border rounded-2xl shadow-sm p-4 flex items-center gap-4 hover:shadow-lg transition text-green-600"
            >
              <Image
                src={s.image}
                alt={s.name}
                width={200}
                height={120}
                className="rounded-md object-cover"
              />
              <div>
                <h3 className="font-bold text-white">{s.name}</h3>
                <p className="text-gray-500 text-sm">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSpecies && (
        <SpeciesPopup
          species={selectedSpecies}
          onClose={() => setSelectedSpecies(null)}
        />
      )}
    </div>
  );
}
