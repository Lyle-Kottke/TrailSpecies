
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapProps {
  geometry: any;
  height?: string;
}

export default function Map({ geometry, height = "400px"}: MapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    console.log("Rendering map with geometry:", geometry);

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-71.925543154266, 42.38103835124582],
      zoom: 7,
    });

    mapRef.current = map;

    map.on("load", () => {
      console.log("Mapbox loaded");

      console.log(geometry)
      
      map.addSource("trail", {
        type: "geojson",
        data: geometry,
      });


      // Outline layer (bottom)
      map.addLayer({
        id: "trail-line-outline",
        type: "line",
        source: "trail",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#003322",
          "line-width": 8,
        },
      });

      // Main line (top)
      map.addLayer({
        id: "trail-line",
        type: "line",
        source: "trail",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#00aa55",
          "line-width": 6,
        },
      });


      const bounds = new mapboxgl.LngLatBounds();


      try { //zoom to trail
        map.flyTo({
          center: geometry.features[0].geometry.coordinates[0], // The longitude and latitude of the point
          zoom: 14, // The desired zoom level (adjust as needed)
          essential: true // This ensures the animation plays even if the user interacts with the map
        });
      } catch (err) {
        console.error("Bounds error:", err);
      }
    });

    map.on("error", (e) => console.error("Mapbox error:", e.error));
  }, [geometry]);

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden shadow"
      style={{ width: "100%", height }}
    />
  );
}