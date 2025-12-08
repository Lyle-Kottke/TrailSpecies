"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import SpeciesPopup from "@/components/SpeciesPopup";

import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function TrailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = decodeURIComponent(params.id as string); // trail name in URL

  const [trail, setTrail] = useState<any | null>(null);
  const [species, setSpecies] = useState<any[] | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // convert to string for back link
  const paramsString = searchParams ? `?${searchParams.toString()}` : "";
  
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
        //console.log(props)
        setTrail({
          name: props.name,
          trailtype: props.trailtype,
          lengthmiles: props.lengthmiles,
          geometry: geojson,
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
      const currentMonth = new Date().getMonth() + 1;
      console.log(currentMonth, "Current Month!", encodeURIComponent(trail.name), "Trail name!")

      const res = await fetch(
        `https://trailgeoapi.onrender.com/species_by_trail?trail_name=${encodeURIComponent(
          trail.name
        )}&current_month=${currentMonth}`
      );
      const raw = await res.json();
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      //No results
      if (data.length == 0) {
        setLoading(false)
        setSpecies([])
        return;
      }

      const speciesArray = Object.values(data["species_guess"]) as string[];
      const imageArray = Object.values(data["taxon.default_photo.medium_url"]) as string[];
      const commnameArray = Object.values(data["taxon.preferred_common_name"])

      //convert array into structured objects
      const baseSpecies = speciesArray.map((s, i) => ({
        id: i + 1,
        name: s,
        description: "",
        image: imageArray[i],
        common_name: commnameArray[i] || s
      }));

      //remove dupes
      const uniqueSpecies = baseSpecies.filter(
        (s, idx, self) => idx === self.findIndex(t => t.name === s.name)
      );
      //wiki lookup for each species
      const enrichedSpecies = await Promise.all(
        uniqueSpecies.map(async (sp) => {
          try {
            const wikiRes = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
                sp.name
              )}`
            );

            if (!wikiRes.ok) return sp; //fallback

            const wikiData = await wikiRes.json();

            return {
              ...sp,
              description: wikiData.extract || "",
              // image:
              //   wikiData.originalimage?.source ||
              //   wikiData.thumbnail?.source ||
              //   "",
            };
          } catch (err) {
            console.warn("Wikipedia lookup failed:", sp.name, err);
            return sp;
          }
        })
      );

      setSpecies(enrichedSpecies);
    } catch (err) {
      console.error("Failed to fetch species:", err);
      setSpecies([]);
    }
  };

  fetchSpecies();
}, [trail]);

  if (!trail) return <p className="p-8 text-red-600">Trail not found</p>;

  //Captialize helper
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="p-8">
      <a
        href={`/results${paramsString}`}
        className="text-green-600 hover:underline"
      >
        ← Back to results
      </a>

      <h1 className="text-3xl font-bold mt-4">{trail.name}</h1>
      <p className="text-gray-500 mb-6">{trail.trailtype}</p>

      <h2 className="text-2xl font-semibold mb-4">Map</h2>

      <div className="mb-10">
        <Map geometry={trail.geometry}/>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Species Found Here</h2>
      {species && species.length === 0 && !loading && (
        <p>No species found at trail</p>)}
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
              <div className="relative w-[100px] h-[100px]">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  className="rounded-md object-cover rounded-lg"
                />
              </div>

              <h3 className="font-bold text-white">{capitalize(s.common_name)}</h3>
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
