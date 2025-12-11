import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import InstallTabs from "@/components/InstallTabs";
import { getPackages } from "@/lib/registry";

const releaseVersion = "v1.0.0";
const releasePageUrl = `https://github.com/devkiraa/nex/releases/tag/${releaseVersion}`;

export default async function HomePage() {
  const packages = await getPackages();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-red-500 to-red-700 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container relative text-center">
          <div
            className="text-7xl font-bold mb-6 bg-gradient-to-br from-white via-gray-100 to-gray-200 bg-clip-text text-transparent"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
          >
            nex
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-4">
            Build amazing tools.
            <span className="block text-white/90">Share them with the world.</span>
          </h1>
          <p className="text-xl opacity-90 max-w-xl mx-auto mb-8">
            The package manager for developer tools. Install, run, and share
            utilities with a single command.
          </p>

          <SearchForm large />

          <div className="flex justify-center gap-16">
            <div className="text-center">
              <span className="block text-4xl font-bold">{packages.length}</span>
              <span className="text-sm opacity-80">Packages</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-bold">3</span>
              <span className="text-sm opacity-80">Platforms</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-bold">∞</span>
              <span className="text-sm opacity-80">Possibilities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Install Section */}
      <section className="relative z-10 -mt-8 pb-8">
        <div className="container">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-6 pt-5 pb-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-500 block">
                  Latest release
                </span>
                <span className="text-2xl font-bold text-red-500">
                  {releaseVersion}
                </span>
              </div>
              <a
                href={releasePageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 font-medium hover:underline"
              >
                View release notes
              </a>
            </div>

            <InstallTabs releaseVersion={releaseVersion} />

            <div className="flex gap-4 justify-center py-6 bg-gray-50">
              <a
                href={releasePageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Download nex {releaseVersion}
              </a>
              <Link href="/docs" className="btn btn-secondary">
                Read the Docs
              </Link>
            </div>
            <p className="text-center text-sm text-gray-500 pb-6 px-6">
              Checksums and binaries are hosted on GitHub Releases. Always verify
              downloads before installing.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why nex?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "Zero Dependencies",
                desc: "Single executable binary. No runtime required. Works on Windows, Linux, and macOS.",
              },
              {
                icon: "📦",
                title: "GitHub-Powered",
                desc: "Package registry lives on GitHub. Fork, submit PRs, and collaborate openly.",
              },
              {
                icon: "🔧",
                title: "Multi-Runtime",
                desc: "Run Python, Node.js, PowerShell, Bash scripts and native binaries seamlessly.",
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Written in C for maximum performance. Instant installs and execution.",
              },
              {
                icon: "🔒",
                title: "Secure",
                desc: "Packages are reviewed via pull requests. SHA256 checksums for downloads.",
              },
              {
                icon: "💚",
                title: "Open Source",
                desc: "MIT licensed. Community-driven. Free forever.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Discover Packages</h2>
            <Link
              href="/packages"
              className="text-red-500 font-medium hover:underline"
            >
              View all packages →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.slice(0, 6).map((pkg) => (
              <Link
                key={pkg.id}
                href={`/packages/${pkg.id}`}
                className="block bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-red-500 hover:shadow-lg hover:-translate-y-1 transition-all no-underline"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {pkg.name}
                  </h3>
                  <span className="text-sm text-green-600 bg-gray-100 px-2 py-1 rounded">
                    v{pkg.version}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-mono mb-3">{pkg.id}</p>
                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {pkg.keywords?.slice(0, 3).map((kw: string) => (
                    <span
                      key={kw}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {packages.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p>
                No packages available yet. Be the first to{" "}
                <a
                  href="https://github.com/devkiraa/nex"
                  className="text-red-500"
                >
                  contribute
                </a>
                !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to share your tools?</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Publishing a package is simple. Create a manifest, submit a PR, and
            you&apos;re live.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/docs" className="btn btn-primary">
              Get Started
            </Link>
            <a
              href="https://github.com/devkiraa/nex"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark flex items-center gap-2"
            >
              <svg
                viewBox="0 0 16 16"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Star on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
