import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Learn how to use nex package manager",
};

const manifestExample = `{
  "id": "yourname.your-tool",
  "name": "Your Tool Name",
  "version": "1.0.0",
  "description": "What your tool does",
  "author": {
    "name": "Your Name",
    "github": "yourusername"
  },
  "license": "MIT",
  "repository": "https://github.com/yourname/your-tool",
  "runtime": {
    "type": "python",
    "version": ">=3.8"
  },
  "entrypoint": "main.py",
  "commands": {
    "default": "python main.py",
    "help": "python main.py --help"
  },
  "keywords": ["cli", "utility", "tool"],
  "platforms": ["windows", "linux", "macos"]
}`;

export default function DocsPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-500 to-red-700 text-white py-12 text-center">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2">Documentation</h1>
          <p className="text-lg opacity-90">
            Everything you need to know about using nex
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <nav className="bg-gray-100 rounded-lg p-6">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                Getting Started
              </h4>
              <ul className="space-y-2 mb-6">
                <li>
                  <a href="#installation" className="text-gray-700 hover:text-red-500 text-sm">
                    Installation
                  </a>
                </li>
                <li>
                  <a href="#quickstart" className="text-gray-700 hover:text-red-500 text-sm">
                    Quick Start
                  </a>
                </li>
              </ul>

              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                Usage
              </h4>
              <ul className="space-y-2 mb-6">
                <li>
                  <a href="#commands" className="text-gray-700 hover:text-red-500 text-sm">
                    Commands
                  </a>
                </li>
                <li>
                  <a href="#installing" className="text-gray-700 hover:text-red-500 text-sm">
                    Installing Packages
                  </a>
                </li>
                <li>
                  <a href="#running" className="text-gray-700 hover:text-red-500 text-sm">
                    Running Packages
                  </a>
                </li>
                <li>
                  <a href="#managing" className="text-gray-700 hover:text-red-500 text-sm">
                    Managing Packages
                  </a>
                </li>
              </ul>

              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                Package Authors
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#creating" className="text-gray-700 hover:text-red-500 text-sm">
                    Creating Packages
                  </a>
                </li>
                <li>
                  <a href="#manifest" className="text-gray-700 hover:text-red-500 text-sm">
                    Manifest Schema
                  </a>
                </li>
                <li>
                  <a href="#publishing" className="text-gray-700 hover:text-red-500 text-sm">
                    Publishing
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="docs-content">
            <section id="installation" className="mb-12 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Installation</h2>

              <h3 className="text-lg font-semibold mb-4">Download</h3>
              <p className="text-gray-600 mb-4">
                Download nex v1.0.0 from GitHub Releases:
              </p>
              <a
                href="https://github.com/devkiraa/nex/releases/tag/v1.0.0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors no-underline mb-6"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                View v1.0.0 Release
              </a>

              <h3 className="text-lg font-semibold mb-4">Windows</h3>
              <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-800 px-4 py-2 text-gray-400 text-sm">
                  Download &amp; install
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-cyan-400">
                    curl -LO https://github.com/devkiraa/nex/releases/download/v1.0.0/nex-windows-x64.exe{"\n"}
                    move .\nex-windows-x64.exe %USERPROFILE%\bin\nex.exe
                  </code>
                </pre>
              </div>

              <h3 className="text-lg font-semibold mb-4">Linux</h3>
              <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-800 px-4 py-2 text-gray-400 text-sm">
                  Download &amp; install
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-cyan-400">
                    curl -LO https://github.com/devkiraa/nex/releases/download/v1.0.0/nex-linux-x64{"\n"}
                    sudo install -m 755 nex-linux-x64 /usr/local/bin/nex
                  </code>
                </pre>
              </div>

              <h3 className="text-lg font-semibold mb-4">macOS</h3>
              <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-800 px-4 py-2 text-gray-400 text-sm">
                  Download &amp; install
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-cyan-400">
                    curl -LO https://github.com/devkiraa/nex/releases/download/v1.0.0/nex-macos-x64{"\n"}
                    sudo install -m 755 nex-macos-x64 /usr/local/bin/nex
                  </code>
                </pre>
              </div>

              <h3 className="text-lg font-semibold mb-4">Verify Installation</h3>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="p-4 text-sm">
                  <code className="text-cyan-400">nex --version</code>
                </pre>
              </div>
            </section>

            <section id="quickstart" className="mb-12 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
              <p className="text-gray-600 mb-6">
                Get up and running with nex in seconds:
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Search for a package</h4>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-cyan-400">nex search markdown</code>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Install the package</h4>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-cyan-400">
                        nex install devkiraa.pagepull
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Run the package</h4>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-cyan-400">
                        nex run devkiraa.pagepull
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="commands" className="mb-12 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Command Reference</h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left px-4 py-3 font-semibold">Command</th>
                      <th className="text-left px-4 py-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["nex install <package>", "Install a package from the registry"],
                      ["nex run <package> [cmd]", "Run a package command"],
                      ["nex update [package]", "Update package(s) to latest version"],
                      ["nex remove <package>", "Remove an installed package"],
                      ["nex list", "List installed packages"],
                      ["nex search <query>", "Search the package registry"],
                      ["nex info <package>", "Show package details"],
                      ["nex --version", "Show nex version"],
                      ["nex --help", "Show help message"],
                    ].map(([cmd, desc]) => (
                      <tr key={cmd} className="border-t border-gray-200">
                        <td className="px-4 py-3">
                          <code className="text-red-500 bg-gray-100 px-2 py-1 rounded text-sm">
                            {cmd}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="installing" className="mb-12 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Installing Packages</h2>
              <p className="text-gray-600 mb-4">
                Install packages using the package ID:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <code className="text-cyan-400">nex install author.package-name</code>
              </div>
              <p className="text-gray-600">
                Packages are installed to <code>~/.nex/packages/</code> and can be run
                from anywhere.
              </p>
            </section>

            <section id="running" className="mb-12 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Running Packages</h2>

              <h3 className="text-lg font-semibold mb-4">Default Command</h3>
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <code className="text-cyan-400">nex run author.package-name</code>
              </div>

              <h3 className="text-lg font-semibold mb-4">Specific Command</h3>
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <code className="text-cyan-400">
                  nex run author.package-name command-name
                </code>
              </div>

              <h3 className="text-lg font-semibold mb-4">With Arguments</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-cyan-400">
                  nex run author.package-name convert --input file.txt
                </code>
              </div>
            </section>

            <section id="managing" className="mb-12 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Managing Packages</h2>

              <div className="space-y-6">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 text-gray-400 text-sm">
                    List installed packages
                  </div>
                  <pre className="p-4">
                    <code className="text-cyan-400">nex list</code>
                  </pre>
                </div>

                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 text-gray-400 text-sm">
                    Update a specific package
                  </div>
                  <pre className="p-4">
                    <code className="text-cyan-400">
                      nex update author.package-name
                    </code>
                  </pre>
                </div>

                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 text-gray-400 text-sm">
                    Update all packages
                  </div>
                  <pre className="p-4">
                    <code className="text-cyan-400">nex update</code>
                  </pre>
                </div>

                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 text-gray-400 text-sm">
                    Remove a package
                  </div>
                  <pre className="p-4">
                    <code className="text-cyan-400">
                      nex remove author.package-name
                    </code>
                  </pre>
                </div>
              </div>
            </section>

            <section id="creating" className="mb-12 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Creating Packages</h2>

              <h3 className="text-lg font-semibold mb-4">Package ID Format</h3>
              <p className="text-gray-600 mb-4">
                Package IDs follow the format <code>author.package-name</code>:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Use lowercase letters, numbers, and hyphens only</li>
                <li>Author is typically your GitHub username</li>
                <li>Package name should be descriptive</li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <strong>Example:</strong> <code>devkiraa.pagepull</code>
              </div>
            </section>

            <section id="manifest" className="mb-12 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Manifest Schema</h2>
              <p className="text-gray-600 mb-4">
                Create a <code>nex.json</code> file in your package repository:
              </p>

              <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-800 px-4 py-2 text-gray-400 text-sm">
                  nex.json
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-cyan-400">{manifestExample}</code>
                </pre>
              </div>

              <h3 className="text-lg font-semibold mb-4">Required Fields</h3>
              <div className="space-y-3">
                {[
                  ["id", "Unique package identifier (author.name format)"],
                  ["name", "Human-readable package name"],
                  ["version", "Semantic version (e.g., 1.0.0)"],
                  ["description", "Brief description of the package"],
                  ["repository", "GitHub repository URL"],
                ].map(([field, desc]) => (
                  <div
                    key={field}
                    className="flex gap-4 py-3 border-b border-gray-200"
                  >
                    <code className="text-red-500 bg-gray-100 px-2 py-1 rounded text-sm min-w-[120px]">
                      {field}
                    </code>
                    <span className="text-gray-600">{desc}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="publishing" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Publishing</h2>
              <p className="text-gray-600 mb-4">
                To publish your package to the nex registry:
              </p>

              <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
                <li>
                  Create your tool repository with a valid <code>nex.json</code>
                </li>
                <li>
                  Fork the{" "}
                  <a
                    href="https://github.com/devkiraa/nex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-500"
                  >
                    nex repository
                  </a>
                </li>
                <li>
                  Add your package to <code>registry/index.json</code>
                </li>
                <li>
                  Create your manifest file in <code>registry/packages/</code>
                </li>
                <li>Submit a pull request</li>
              </ol>

              <a
                href="https://github.com/devkiraa/nex"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors no-underline"
              >
                Submit a Package
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
