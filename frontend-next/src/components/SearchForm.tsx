"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm({ large = false }: { large?: boolean }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/packages?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/packages");
    }
  };

  if (large) {
    return (
      <form onSubmit={handleSubmit} className="relative max-w-[650px] mx-auto mb-10">
        <div className="flex bg-white rounded-xl p-2 shadow-lg">
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search packages..."
            className="flex-1 py-4 px-4 pl-12 border-none text-lg bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
            autoComplete="off"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 max-w-[600px]">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search packages..."
        className="flex-1 py-3 px-4 border-2 border-gray-200 border-r-0 rounded-l-lg text-base outline-none focus:border-red-500 transition-colors"
        autoComplete="off"
      />
      <button
        type="submit"
        className="py-3 px-6 bg-gray-900 text-white rounded-r-lg font-semibold hover:bg-red-500 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
