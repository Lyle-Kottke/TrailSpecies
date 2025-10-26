export type Species = {
  id: number;
  name: string;
  description: string;
  image: string;
};

export async function getSpeciesForTrail(trailId: string): Promise<Species[]> {
  // Simulated delay
  await new Promise((res) => setTimeout(res, 1000));

  // Dummy species data
  return [
    {
      id: 1,
      name: "Mountain Bluebird",
      description: "A bright blue songbird often seen on open trails.",
      image: "https://source.unsplash.com/800x400/?bird,bluebird",
    },
    {
      id: 2,
      name: "White-tailed Deer",
      description: "Commonly spotted near forested areas.",
      image: "https://source.unsplash.com/800x400/?deer",
    },
    {
      id: 3,
      name: "Red Fox",
      description: "Clever and curious, often active at dawn and dusk.",
      image: "https://source.unsplash.com/800x400/?fox",
    },
  ];
}
