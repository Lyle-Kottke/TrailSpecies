"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import SpeciesPopup from "@/components/SpeciesPopup";

export default function TrailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = decodeURIComponent(params.id as string); // trail name in URL
  const query = searchParams.get("query") || "";

  const [trail, setTrail] = useState<any | null>(null);
  const [species, setSpecies] = useState<any[] | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrail() {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://trailgeoapi.onrender.com/trails_by_name?name=${encodeURIComponent(id)}`
        );

        const raw = await res.json();
        // Backend returns JSON string → parse it
        const geojson = typeof raw === "string" ? JSON.parse(raw) : raw;
        const feature = geojson.features?.[0];

        if (!feature) throw new Error("Trail not found");

        const props = feature.properties;
        setTrail({
          name: props.name,
          trailtype: props.trailtype,
          lengthmiles: props.lengthmiles,
          geometry: feature.geometry,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrail();
  }, [id]);


useEffect(() => {
  if (!trail) return;

  const fetchSpecies = async () => {
    try {
      // Get current month (1-12)
      const currentMonth = new Date().getMonth() + 1;

      const res = await fetch(
        `https://trailgeoapi.onrender.com/species_by_trail?trail_name=${encodeURIComponent(
          trail.name
        )}&current_month=${currentMonth}`
      );

      const raw = await res.json();
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;

      // Backend returns JSON string of array
      const speciesArray = Object.values(data) as string[];


      // Convert array to objects for your SpeciesPopup
      
      const speciesObjects = speciesArray.map((s: string, i: number) => ({
        id: i + 1,
        name: s,
        description: "", // you can populate descriptions if you have them
        image: "", // or placeholder images
      }));

      const uniqueSpeciesObjects = speciesObjects.filter(
        (s, index, self) =>
          index === self.findIndex((t) => t.name === s.name)
      );

      setSpecies(uniqueSpeciesObjects);
    } catch (err) {
      console.error("Failed to fetch species:", err);
      setSpecies([]);
    }
  };

  fetchSpecies();
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
      <p className="text-gray-500 mb-6">{trail.trailtype}</p>

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
