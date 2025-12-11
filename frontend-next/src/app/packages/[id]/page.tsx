import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackages, getPackageManifest, type Manifest } from "@/lib/registry";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const packages = await getPackages();
  return packages.map((pkg) => ({ id: pkg.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const packages = await getPackages();
  const pkg = packages.find((p) => p.id === id);
  return {
    title: pkg?.name || id,
    description: pkg?.description || `Details for ${id}`,
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { id } = await params;
  const packages = await getPackages();
  const pkg = packages.find((p) => p.id === id);

  if (!pkg) {
    notFound();
  }

  let manifest: Manifest | null = null;
  if (pkg.manifest) {
    manifest = await getPackageManifest(pkg.manifest);
  }

  const data = manifest || pkg;

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-500 to-red-700 text-white py-8 px-4">
        <div className="container">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white no-underline mb-6"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to packages
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">{data.name}</h1>
              <p className="font-mono text-white/90 mb-4">{data.id}</p>
              <p className="text-lg opacity-95 mb-6">{data.description}</p>
              <div className="flex gap-3">
                <span className="bg-white/20 px-3 py-1 rounded text-sm font-medium">
                  v{data.version}
                </span>
                {manifest?.license && (
                  <span className="bg-white/20 px-3 py-1 rounded text-sm font-medium">
                    {manifest.license}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 text-gray-900">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                Install
              </h4>
              <div className="bg-gray-900 rounded-md p-4 flex items-center gap-2">
                <code className="text-cyan-400 text-sm flex-1 font-mono">
                  nex install {data.id}
                </code>
                <button
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                  title="Copy"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* Main */}
          <div>
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
                Usage
              </h2>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 text-gray-400 text-sm">
                  Run this package
                </div>
                <pre className="p-4">
                  <code className="text-cyan-400">nex run {data.id}</code>
                </pre>
              </div>
            </section>

            {manifest?.commands && Object.keys(manifest.commands).length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
                  Available Commands
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left px-4 py-3 font-semibold">
                          Command
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">Runs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(manifest.commands).map(([name, cmd]) => (
                        <tr key={name} className="border-t border-gray-200">
                          <td className="px-4 py-3">
                            <code className="text-red-500 bg-gray-100 px-2 py-1 rounded text-sm">
                              nex run {data.id} {name}
                            </code>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-gray-600 text-sm">{cmd}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {data.keywords && data.keywords.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
                  Keywords
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {data.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Details</h3>
              <dl className="space-y-3">
                {manifest?.author && (
                  <>
                    <dt className="text-sm text-gray-500">Author</dt>
                    <dd>
                      {typeof manifest.author === "string" ? (
                        manifest.author
                      ) : manifest.author.github ? (
                        <a
                          href={`https://github.com/${manifest.author.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:underline"
                        >
                          @{manifest.author.github}
                        </a>
                      ) : (
                        manifest.author.name
                      )}
                    </dd>
                  </>
                )}

                <dt className="text-sm text-gray-500">Version</dt>
                <dd>{data.version}</dd>

                {manifest?.license && (
                  <>
                    <dt className="text-sm text-gray-500">License</dt>
                    <dd>{manifest.license}</dd>
                  </>
                )}

                {manifest?.runtime && (
                  <>
                    <dt className="text-sm text-gray-500">Runtime</dt>
                    <dd>
                      {manifest.runtime.type} {manifest.runtime.version}
                    </dd>
                  </>
                )}

                {manifest?.platforms && (
                  <>
                    <dt className="text-sm text-gray-500">Platforms</dt>
                    <dd className="flex gap-2 flex-wrap">
                      {manifest.platforms.map((p) => (
                        <span
                          key={p}
                          className="bg-gray-200 px-2 py-1 rounded text-sm"
                        >
                          {p}
                        </span>
                      ))}
                    </dd>
                  </>
                )}
              </dl>
            </div>

            {manifest?.repository && (
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Repository</h3>
                <a
                  href={manifest.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-red-500 no-underline"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
