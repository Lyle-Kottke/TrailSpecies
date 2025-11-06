"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'


export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data, error }) => {
      if (data?.user) {
        setUser(data.user)
      }
    })
  }, [])

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
      <div className="mt-8 text-gray-500">
        {user ? (// EXAMPLE USAGE, DELETE IF NEEDED
          <h1>Welcome, {user.email}!</h1>
        ) : (
          <div>
            <h1>Log in if you want to save trails.</h1>
          </div>
        )}
      </div>

      
    </div>
  );
}
