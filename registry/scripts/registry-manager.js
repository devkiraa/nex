const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration
const REGISTRY_ROOT = path.join(__dirname, '../packages');
const INDEX_FILE = path.join(__dirname, '../index.json');

/**
 * Helper to fetch JSON from a URL
 */
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

/**
 * Convert raw GitHub URL to raw.githubusercontent format
 */
function getRawUrl(repoUrl) {
    // Convert https://github.com/user/repo to https://raw.githubusercontent.com/user/repo/main/manifest.json
    // Handling different branches could be improved, defaulting to main/master logic or via API
    let raw = repoUrl.replace('github.com', 'raw.githubusercontent.com');
    if (raw.endsWith('.git')) raw = raw.slice(0, -4);
    if (!raw.includes('/main/') && !raw.includes('/master/')) {
        return `${raw}/main/manifest.json`; // Default assumption
    }
    return raw;
}

/**
 * Resolve the raw manifest URL. Tries main, then master.
 */
async function resolveManifestUrl(repoUrl) {
    const base = repoUrl.replace('https://github.com/', 'https://raw.githubusercontent.com/').replace(/\/$/, "");
    const branches = ['main', 'master'];

    for (const branch of branches) {
        const url = `${base}/${branch}/manifest.json`;
        try {
            await fetchJson(url);
            return url;
        } catch (e) {
            // continue
        }
    }
    throw new Error(`Could not find manifest.json in ${repoUrl} (checked main and master)`);
}

/**
 * Add or Update a package
 */
async function syncPackage(repoUrl) {
    console.log(`\n🔄 Processing ${repoUrl}...`);

    try {
        const manifestUrl = await resolveManifestUrl(repoUrl);
        const manifest = await fetchJson(manifestUrl);

        // Validation
        if (!manifest.id || !manifest.version || !manifest.id.includes('.')) {
            throw new Error(`Invalid manifest: Missing ID (author.pkg) or Version.`);
        }

        // Enforce repository URL in manifest for future updates
        manifest.repository = repoUrl;

        // Path Calculation: registry/packages/a/author/pkg/manifest.json
        const [author, pkgName] = manifest.id.split('.');
        const firstLetter = author[0].toLowerCase();
        const pkgDir = path.join(REGISTRY_ROOT, firstLetter, author, pkgName);

        // Create Dir
        fs.mkdirSync(pkgDir, { recursive: true });

        // Write manifest
        const destFile = path.join(pkgDir, 'manifest.json');

        // Check if update is needed
        let isUpdate = false;
        if (fs.existsSync(destFile)) {
            const current = JSON.parse(fs.readFileSync(destFile));
            if (current.version === manifest.version) {
                console.log(`   ✅ Already up to date (${manifest.version})`);
                return;
            }
            console.log(`   ⬆️  Updating ${current.version} -> ${manifest.version}`);
            isUpdate = true;
        } else {
            console.log(`   ✨ New package: ${manifest.id} v${manifest.version}`);
            isUpdate = true;
        }

        if (isUpdate) {
            fs.writeFileSync(destFile, JSON.stringify(manifest, null, 2));
            updateIndex(manifest);
        }

    } catch (error) {
        console.error(`   ❌ Failed: ${error.message}`);
        process.exitCode = 1;
    }
}

/**
 * Update the global index.json
 */
function updateIndex(newManifest) {
    let index = { packages: [] };
    if (fs.existsSync(INDEX_FILE)) {
        index = JSON.parse(fs.readFileSync(INDEX_FILE));
    }

    const existingIdx = index.packages.findIndex(p => p.id === newManifest.id);

    // Minimal metadata for the index
    const indexEntry = {
        id: newManifest.id,
        name: newManifest.name,
        version: newManifest.version,
        description: newManifest.description,
        author: newManifest.author,
        category: newManifest.category || 'General',
        keywords: newManifest.keywords || [],
        repository: newManifest.repository,
        updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
        index.packages[existingIdx] = { ...index.packages[existingIdx], ...indexEntry };
    } else {
        index.packages.push(indexEntry);
    }

    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
    console.log(`   📝 Index updated.`);
}

// --- Main CLI ---
const mode = process.argv[2];
const target = process.argv[3];

if (mode === 'add') {
    if (!target) {
        console.error("Usage: node registry-manager.js add <github_url>");
        process.exit(1);
    }
    syncPackage(target);
}
else if (mode === 'update-all') {
    if (!fs.existsSync(INDEX_FILE)) {
        console.log("No index to update.");
        return;
    }
    const index = JSON.parse(fs.readFileSync(INDEX_FILE));
    console.log(`Checking ${index.packages.length} packages for updates...`);

    // Process strictly sequentially to avoid rate limits
    (async () => {
        for (const pkg of index.packages) {
            if (pkg.repository) {
                await syncPackage(pkg.repository);
            }
        }
    })();
}
else {
    console.log("Unknown command. Use 'add <url>' or 'update-all'");
}
