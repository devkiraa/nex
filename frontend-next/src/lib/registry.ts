export interface Package {
  id: string;
  name: string;
  version: string;
  description: string;
  keywords?: string[];
  manifest?: string;
}

export interface Manifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: { name: string; github?: string } | string;
  license?: string;
  repository?: string;
  runtime?: { type: string; version: string };
  entrypoint?: string;
  commands?: Record<string, string>;
  keywords?: string[];
  platforms?: string[];
}

const REGISTRY_URL =
  "https://raw.githubusercontent.com/devkiraa/nex/main/registry/index.json";

export async function getPackages(): Promise<Package[]> {
  try {
    const response = await fetch(REGISTRY_URL, { next: { revalidate: 60 } });
    const data = await response.json();
    return data.packages || [];
  } catch {
    return [];
  }
}

export async function getPackageManifest(
  manifestPath: string
): Promise<Manifest | null> {
  try {
    const url = `https://raw.githubusercontent.com/devkiraa/nex/main/registry/${manifestPath}`;
    const response = await fetch(url, { next: { revalidate: 60 } });
    return await response.json();
  } catch {
    return null;
  }
}
