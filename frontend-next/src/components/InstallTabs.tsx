"use client";

import { useState } from "react";

const releaseBaseUrl = "https://github.com/devkiraa/nex/releases/download";

interface InstallTabsProps {
  releaseVersion: string;
}

export default function InstallTabs({ releaseVersion }: InstallTabsProps) {
  const [activeTab, setActiveTab] = useState<"windows" | "linux" | "mac">(
    "windows"
  );

  const downloadLinks = {
    windows: `${releaseBaseUrl}/${releaseVersion}/nex-windows-x64.exe`,
    linux: `${releaseBaseUrl}/${releaseVersion}/nex-linux-x64`,
    mac: `${releaseBaseUrl}/${releaseVersion}/nex-macos-x64`,
  };

  const tabs = [
    { id: "windows" as const, label: "Windows" },
    { id: "linux" as const, label: "Linux" },
    { id: "mac" as const, label: "macOS" },
  ];

  return (
    <>
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-base font-medium border-b-3 transition-colors ${
              activeTab === tab.id
                ? "text-red-500 border-red-500"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
            style={{ borderBottomWidth: "3px", marginBottom: "-1px" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-900">
        {activeTab === "windows" && (
          <pre className="m-0 rounded-none text-sm leading-7 p-4">
            <code>
              <span className="text-green-400"># Download nex {releaseVersion}</span>
              {"\n"}curl -LO {downloadLinks.windows}
              {"\n\n"}
              <span className="text-green-400"># Move into a folder on PATH</span>
              {"\n"}move .\nex-windows-x64.exe %USERPROFILE%\bin\nex.exe
              {"\n\n"}
              <span className="text-green-400"># Verify</span>
              {"\n"}nex --version
            </code>
          </pre>
        )}

        {activeTab === "linux" && (
          <pre className="m-0 rounded-none text-sm leading-7 p-4">
            <code>
              <span className="text-green-400"># Download nex {releaseVersion}</span>
              {"\n"}curl -LO {downloadLinks.linux}
              {"\n"}sudo install -m 755 nex-linux-x64 /usr/local/bin/nex
              {"\n\n"}
              <span className="text-green-400"># Verify</span>
              {"\n"}nex --version
            </code>
          </pre>
        )}

        {activeTab === "mac" && (
          <pre className="m-0 rounded-none text-sm leading-7 p-4">
            <code>
              <span className="text-green-400"># Download nex {releaseVersion}</span>
              {"\n"}curl -LO {downloadLinks.mac}
              {"\n"}sudo install -m 755 nex-macos-x64 /usr/local/bin/nex
              {"\n\n"}
              <span className="text-green-400"># Verify</span>
              {"\n"}nex --version
            </code>
          </pre>
        )}
      </div>
    </>
  );
}
