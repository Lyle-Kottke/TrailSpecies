'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUserSearches, getUserSavedTrails } from '@/utils/supabase/userSavedInfo';
import PublicTrailList from '@/components/publicTrailList';
export default function SavedSearchesPage() {
    const [searches, setSearches] = useState<any[]>([]);
    const [savedTrails, setSavedTrails] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSearches = async () => {
            try {
                const searchData = await getUserSearches();
                const trailsData = await getUserSavedTrails();
                setSearches(searchData);
                setSavedTrails(trailsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load searches or Saved Trails');
            } finally {
                setLoading(false);
            }
        };

        fetchSearches();
    }, []);



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Saved Searches</h1>
            <ul className="space-y-2">
                {searches.map((search) => (
                    <li key={search.id} className="p-3 border rounded">
                        <div>{search.searchParams}</div>
                        <Link href={`/results?${search.searchParams}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Search
                        </Link>
                    </li>
                ))}
            </ul>
            <h1 className="text-2xl font-bold my-4">Saved Trails</h1>
            <PublicTrailList trails={savedTrails} baseHref = "/trail" previous_page = "/saved_searches"/>
        </div>
    );
}