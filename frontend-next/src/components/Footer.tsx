import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 mt-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <span className="text-2xl font-bold">⚡ nex</span>
            <p className="text-gray-400 mt-1">Nimble Executor</p>
            <p className="text-gray-400 text-sm mt-2">
              Package manager for developer tools
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 text-white">
              Resources
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/docs"
                className="text-gray-400 hover:text-white no-underline text-sm"
              >
                Documentation
              </Link>
              <Link
                href="/packages"
                className="text-gray-400 hover:text-white no-underline text-sm"
              >
                Browse Packages
              </Link>
              <a
                href="https://github.com/devkiraa/nex/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white no-underline text-sm"
              >
                Releases
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 text-white">
              Community
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/devkiraa/nex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white no-underline text-sm"
              >
                GitHub
              </a>
              <a
                href="https://github.com/devkiraa/nex/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white no-underline text-sm"
              >
                Report Issues
              </a>
              <a
                href="https://github.com/devkiraa/nex/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white no-underline text-sm"
              >
                Contributing
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 text-white">
              Legal
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/devkiraa/nex/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white no-underline text-sm"
              >
                MIT License
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Nex Contributors</p>
        </div>
      </div>
    </footer>
  );
}
