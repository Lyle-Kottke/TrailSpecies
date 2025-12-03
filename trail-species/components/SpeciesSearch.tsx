"use client";
import { useState, useEffect, useRef} from "react";

export default function SpeciesSearch({ onInclude, onExclude }: { onInclude: (taxon: any) => void; onExclude: (taxon: any) => void;}) {
   // ... Component code here
    const [text, setText] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    //Handles Typing inside the species search bar, then sends the user data to iNaturalist 
    useEffect(() => {
    if (text.length < 2) {
        setResults([]);
        return;
    }

    const timer = setTimeout(async () => {
        setLoading(true);

        const res = await fetch(
            `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(text)}`
        );
        const data = await res.json();
        setLoading(false);

        setResults(data.results || []);
        setShowDropdown(true);
    }, 1000); // debounce delay

    return () => clearTimeout(timer);
    }, [text]);

    //Closes dropbox when click outside of the species search regions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <div ref={containerRef} className='relative w-full max-w-xl mt-6'>
            <div className="relative w-full max-w-xl mt-6">
                {/* Input box */}
                <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Search by species (e.g., bear, spider)"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 text-gray-100 border border-zinc-700 outline-none"
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                />

                {/* Dropdown */}
                {showDropdown && (loading || results.length > 0) &&  (
                    <div className="absolute z-50 mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-xl max-h-64 overflow-auto shadow-lg">
                    
                    {/* Loading State */}
                    {loading && (
                        <div className="p-3 text-gray-400 text-sm">Searching…</div>
                    )}
                    
                    {/* No results */}
                    {!loading && text.length > 0 && results.length === 0 && (
                        <div className="p-3 text-gray-400 text-sm">No results found</div>
                    )}

                    {/* Results */}
                    {!loading && results.length > 0 && (
                        results.map((taxon) => (
                            <div key={taxon.id} className="px-4 py-2 hover:bg-zinc-800 border-b border-zinc-800">
                            {/* Row 1: Taxon name */}
                            <div className="text-gray-100 font-medium">
                                {taxon.preferred_common_name || taxon.name}
                            </div>

                            {/* Row 2: Scientific name + rank */}
                            <div className="text-xs text-gray-500 mb-2">
                                {taxon.rank} — {taxon.name}
                            </div>

                            {/* Row 3: Include / Exclude buttons */}
                            <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                onInclude(taxon);
                                setText("");
                                setShowDropdown(false);
                                }}
                                className="px-2 py-1 text-xs rounded bg-green-700 hover:bg-green-600"
                            >
                                Include
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                onExclude(taxon);
                                setText("");
                                setShowDropdown(false);
                                }}
                                className="px-2 py-1 text-xs rounded bg-red-700 hover:bg-red-600"
                            >
                                Exclude
                            </button>
                            </div>
                        </div>
                        ))
                    )}
                </div>
                )}
            </div>
        </div>
    );

}
