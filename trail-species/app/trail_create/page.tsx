"use client";

import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import "./trail_create.css";

import { addTrailToDatabase } from '@/components/addTrailToDatabase'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function DrawPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  //lines that the user draws will be saved to the variable geometry
  const [geometry, setGeometry] = useState(null); // Feature JSON
  const [trailName, setTrailName] = useState("Unnamed Trail"); // Default trail name

  const [error, setError] = useState<string | null>(null); //errror that will be displayed above the map

  async function saveTrail(){
    const data = await addTrailToDatabase(geometry, trailName) // returns success with status 200 or error with status code
    if (data.error) {
      setError(data.error);
    } else {
      alert("Trail saved successfully!");
      setError(null);
      setTrailName("Unnamed Trail");
    }
  }

  function handleTrailNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTrailName(event.target.value);
  }

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    // Create the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-71.925543154266, 42.38103835124582],
      zoom: 7.5,
    });

    // Create draw control which needs to be added to the map
    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {line_string: true, trash: true},
      styles: [
        {/*Style of active lines */
          id: 'gl-draw-line-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
          paint: {
            'line-color': '#009921',
            'line-width': 4,
            'line-dasharray': [2, 1]
          }
        },
        {/*Style of inactive lines */
          id: 'gl-draw-line-inactive',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'false']],
          paint: {
            'line-color': '#196602',
            'line-width': 3
          }
        },
        {/*Style of active points */
          id: "gl-draw-vertex-point-selected",
          type: "circle",
          filter: [
            "all",
            ["==", "$type", "Point"],
            ["==", "meta", "vertex"],
            ["==", "active", "true"]
          ],
          paint: {
            "circle-radius": 8,
            "circle-color": "#00ff88",
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 3
          }
        },

        {/*Non-Active Point styling */
          id: "gl-draw-vertex-point",
          type: "circle",
          filter: [
            "all",
            ["==", "$type", "Point"],
            ["==", "meta", "vertex"],
            ["==", "active", "false"]
          ],
          paint: {
            "circle-radius": 4,
            "circle-color": "#fff",
            "circle-stroke-color": "#00ff88",
            "circle-stroke-width": 2
      }
        },
        {/*Mid-Point styling */
          id: "gl-draw-midpoint",
          type: "circle",
          filter: [
            "all",
            ["==", "meta", "midpoint"]
          ],
          paint: {
            "circle-radius": 5,
            "circle-color": "#00ff88",
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 2
          }
        },
      ]
    });

    mapRef.current.addControl(drawRef.current);

    // Listeners that captures the geometry that the user creates
    //Listen for line creation
    mapRef.current.on("draw.create", () => {
      const data = drawRef.current.getAll();
      setGeometry(data);
    });

    // Listen for line edits
    mapRef.current.on("draw.update", () => {
      const data = drawRef.current.getAll();
      setGeometry(data);
    });

    // Listen for line deletions
    mapRef.current.on("draw.delete", () => {
      const data = drawRef.current.getAll();
      setGeometry(data);
    });

  }, []);


  return (
  <div className="min-h-screen p-6 bg-black text-white">
    <h1 className="text-3xl font-bold mb-4">Draw on the Map</h1>

    <div className="mb-4">
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      <label htmlFor="trailName" className="block mb-2">Trail Name:</label>
      <input
        type="text"
        id="trailName"
        value={trailName}
        onChange={handleTrailNameChange}
        className="p-2 rounded border border-gray-600 bg-gray-800 text-white w-full"
      />
    </div>

    <div className="trail_create">
      {/* Map */}
      <div 
        ref={mapContainerRef} 
        className="w-full mx-auto rounded-xl overflow-hidden border border-gray-700"
        style={{ height: "75vh" }}  // height of screen in % 
      />
      {/* Save Button */}
      <button
        className="save-btn"
        onClick={saveTrail}>
        Save Custom Trail
      </button>
    </div>    

  </div>
);
}