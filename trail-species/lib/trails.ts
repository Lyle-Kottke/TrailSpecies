import trailsGeoJson from "./MA_State_Trails.json";

export type Trail = {
  id: string;
  name: string;
  description: string;
  geometry: any; // LineString coordinates
  image: string;
};


export const TRAILS: Trail[] = trailsGeoJson.features.map((feature: any) => {
  const name =
    feature.properties.name ||
    feature.properties.namealternate ||
    `Trail ${feature.properties.trailnumber || feature.properties.permanentidentifier}`;

  return {
    id: feature.properties.permanentidentifier,
    name,
    description: `Type: ${feature.properties.trailtype || "Unknown"}, Length: ${
      feature.properties.lengthmiles?.toFixed(2) || "N/A"
    } miles`,
    geometry: feature.geometry,
    image: `https://via.placeholder.com/800x400?text=${encodeURIComponent(name)}`,

  };
});
