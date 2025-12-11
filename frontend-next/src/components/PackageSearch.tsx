"use client";

import { useState } from "react";

export default function PackageSearch() {
  const [query, setQuery] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().trim();
    setQuery(value);

    // Client-side filtering
    const packageList = document.getElementById("package-list");
    const countEl = document.getElementById("count");
    if (!packageList) return;

    const items = packageList.querySelectorAll("a[data-id]");
    let visible = 0;

    items.forEach((item) => {
      const el = item as HTMLElement;
      const name = el.dataset.name || "";
      const id = el.dataset.id || "";
      const desc = el.dataset.description || "";
      const keywords = el.dataset.keywords || "";

      const matches =
        !value ||
        name.includes(value) ||
        id.includes(value) ||
        desc.includes(value) ||
        keywords.includes(value);

      el.style.display = matches ? "" : "none";
      if (matches) visible++;
    });

    if (countEl) {
      countEl.textContent = visible.toString();
    }
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
        onChange={handleInput}
        placeholder="Search packages..."
        className="w-full py-4 px-4 pl-12 text-lg border-none rounded-lg shadow-lg focus:outline-none focus:shadow-xl transition-shadow text-gray-900"
        autoComplete="off"
      />
    </div>
  );
}
