// components/PublicTrailList.tsx
"use client";

import Link from "next/link";

export interface PublicTrail {
  name: string;
  description: string;
  [key: string]: any; // allow extra fields from API
}

interface PublicTrailListProps {
  trails: PublicTrail[];
  baseHref?: string; // default: "/trail"
  previous_page?: string; // default: "/results"
  searchParams?: URLSearchParams;    // so you can preserve ?query=...
}

export default function PublicTrailList({
  trails,
  baseHref = "/trail",
  previous_page = "/results",
  searchParams,
}: PublicTrailListProps) {

  const paramsString = searchParams ? `${searchParams.toString()}` : "";


  if (!trails?.length) {
    return <p className="text-gray-600 mt-4">No trails found.</p>;
  }

  return (
    <div className="mt-8 grid gap-6 w-full max-w-3xl">
      {trails.map((trail) => (
        <Link
          key={trail.name}
          href={`${baseHref}/${encodeURIComponent(trail.name)}?${paramsString}&is_custom_trail=${false}&is_custom_trail=${false}&previous_page=${encodeURIComponent(previous_page)}`}
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
  );
}
