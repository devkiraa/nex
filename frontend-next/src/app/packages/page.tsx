import type { Metadata } from "next";
import Link from "next/link";
import { getPackages } from "@/lib/registry";
import PackageSearch from "@/components/PackageSearch";

export const metadata: Metadata = {
  title: "Search Packages",
  description: "Search and browse nex packages",
};

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-500 to-red-700 text-white py-12 text-center">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6">Search packages</h1>
          <PackageSearch />
          <p className="mt-4 opacity-90">
            <span id="count">{packages.length}</span> packages found
          </p>
        </div>
      </div>

      {/* Package Grid */}
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="package-list">
          {packages.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/packages/${pkg.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-red-500 hover:shadow-lg hover:-translate-y-1 transition-all no-underline"
              data-name={pkg.name.toLowerCase()}
              data-id={pkg.id.toLowerCase()}
              data-description={pkg.description?.toLowerCase() || ""}
              data-keywords={pkg.keywords?.join(" ").toLowerCase() || ""}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-red-500">{pkg.name}</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm font-medium">
                  v{pkg.version}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-mono mb-3">{pkg.id}</p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {pkg.description}
              </p>
              <div className="flex gap-2 flex-wrap mb-4">
                {pkg.keywords?.slice(0, 3).map((kw) => (
                  <span
                    key={kw}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <div className="bg-gray-900 rounded-md p-3">
                <code className="text-cyan-400 text-sm font-mono">
                  nex install {pkg.id}
                </code>
              </div>
            </Link>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-20 h-20 mx-auto mb-6 opacity-50"
            >
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No packages found</h3>
            <p>
              Be the first to{" "}
              <a
                href="https://github.com/devkiraa/nex"
                className="text-red-500 hover:underline"
              >
                submit a package
              </a>
              !
            </p>
          </div>
        )}
      </div>
    </>
  );
}
