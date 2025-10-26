"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/results?query=${encodeURIComponent(query)}`);
  };

  return (
  <div className="flex flex-col items-center justify-center min-h-screen p-8" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Title */}
      <h1 className="text-5xl font-bold mb-4">
        Trail Species
      </h1>

      {/* Description */}
      <p className="text-gray-500 mb-10 text-center max-w-lg">
        Find trails and explore wildlife!
      </p>

      {/* Search bar */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex items-center space-x-2 bg-white rounded-full shadow-md p-3"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a trail..."
          className="flex-1 px-4 py-2 rounded-full outline-none text-gray-700"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
}
