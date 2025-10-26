"use client";

import { useState } from "react";
import Image from "next/image";

type SpeciesPopupProps = {
  species: {
    id: number;
    name: string;
    description: string;
    image: string;
  };
  onClose: () => void;
};

export default function SpeciesPopup({ species, onClose }: SpeciesPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="rounded-xl shadow-xl max-w-lg w-full p-6 relative" style={{ backgroundColor: "#0a0a0a" }}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-500"
        >
          ✕
        </button>

        {/* Species image */}
        <Image
          src={species.image}
          alt={species.name}
          width={400}
          height={250}
          className="rounded-lg object-cover mb-4"
        />

        {/* Species name */}
        <h2 className="text-2xl font-bold mb-2">{species.name}</h2>

        {/* Description */}
        <p className="text-gray-700">{species.description}</p>
      </div>
    </div>
  );
}
