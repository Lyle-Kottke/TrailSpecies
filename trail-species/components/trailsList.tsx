// components/trails/TrailsList.tsx
"use client";

import Link from "next/link";

export interface CustomTrail {
  id: string;
  trail_name: string;
  created_at: string;
  idx: number;
  features: any; // your parsed GeoJSON
}

interface TrailsListProps {
  trails: CustomTrail[];
  baseHref?: string; // default: "/trails"
}

export default function TrailsList({ trails, baseHref = "/trails" }: TrailsListProps) {
  if (!trails?.length) {
    return <p className="text-gray-400 text-sm">No trails found.</p>;
  }

  return (
    <div className="mt-8 grid gap-6 w-full max-w-3xl">
      {trails.map((t) => (
        <Link
          key={t.id}
          href={`${baseHref}/${t.id}`}
          className="block border rounded-2xl shadow-sm hover:shadow-lg transition p-4 text-green-600"
        >
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <p className="text-xl font-semibold text-white">{t.trail_name}</p>
                <p className="text-gray-500">
                    Created: {new Date(t.created_at).toLocaleString()}
                </p>
            </div>
        </Link>
      ))}
    </div>
  );
}
