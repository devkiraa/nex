const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration
const REGISTRY_ROOT = path.join(__dirname, '../packages');
const INDEX_FILE = path.join(__dirname, '../index.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Required for API access

/**
 * Helper to fetch JSON from a URL with headers
 */
function fetchJson(url, headers = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Nex-Registry-Bot',
                ...headers
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 400) {
                    return reject(new Error(`Request failed with ${res.statusCode}: ${data}`));
                }
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

/**
 * Get GitHub repository details from URL
 */
function parseRepoUrl(url) {
    // Supports: https://github.com/user/repo
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) throw new Error("Invalid GitHub URL");
    return { owner: match[1], repo: match[2].replace('.git', '') };
}

/**
 * Recursively find all nex.json/manifest.json files in a repo using GitHub API
 */
async function findManifestsInRepo(repoUrl) {
    const { owner, repo } = parseRepoUrl(repoUrl);
    console.log(`🔍 Scanning ${owner}/${repo} for packages...`);

    const headers = GITHUB_TOKEN ? { 'Authorization': `token ${GITHUB_TOKEN}` } : {};

    // Get the default branch first
    let branch = 'main';
    try {
        const repoInfo = await fetchJson(`https://api.github.com/repos/${owner}/${repo}`, headers);
        branch = repoInfo.default_branch;
    } catch (e) {
        console.warn(`⚠️  Could not get repo info, defaulting to 'main'. Error: ${e.message}`);
    }

    // Fetch the entire tree recursively
    try {
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
        const treeData = await fetchJson(treeUrl, headers);

        if (treeData.truncated) {
            console.warn("⚠️  Repo is too large, some files might be missed.");
        }

        // Filter for nex.json (preferred)
        const manifests = treeData.tree.filter(item => item.path.endsWith('nex.json'));

        if (manifests.length === 0) {
            throw new Error("No nex.json found in repository");
        }

        console.log(`📦 Found ${manifests.length} manifest(s).`);

        // Return raw content URLs
        return manifests.map(file => ({
            url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`,
            path: file.path
        }));
    } catch (e) {
        throw new Error(`Failed to scan recursive tree: ${e.message}`);
    }
}

/**
 * Add or Update a package from a Manifest URL
 */
async function processManifest(manifestUrl, repoUrl) {
    try {
        const manifest = await fetchJson(manifestUrl);

        // Validation
        if (!manifest.id || !manifest.version || !manifest.id.includes('.')) {
            console.warn(`⚠️  Skipping invalid manifest at ${manifestUrl}: Missing ID or Version.`);
            return;
        }

        console.log(`   Processing ${manifest.id} (v${manifest.version})...`);

        // Enforce repository URL in manifest for future updates
        manifest.repository = repoUrl; // Point to root repo
        manifest.manifestUrl = manifestUrl; // Track specific manifest location

        // Path Calculation: registry/packages/a/author/pkg/nex.json
        const [author, pkgName] = manifest.id.split('.');
        const firstLetter = author[0].toLowerCase();
        const pkgDir = path.join(REGISTRY_ROOT, firstLetter, author, pkgName);

        // Create Dir
        fs.mkdirSync(pkgDir, { recursive: true });

        // Write manifest
        const destFile = path.join(pkgDir, 'nex.json');

        // Check if update is needed
        let isUpdate = false;
        if (fs.existsSync(destFile)) {
            const current = JSON.parse(fs.readFileSync(destFile));
            if (current.version === manifest.version) {
                console.log(`      ✅ Up to date.`);
                return;
            }
            console.log(`      ⬆️  Updating ${current.version} -> ${manifest.version}`);
            isUpdate = true;
        } else {
            console.log(`      ✨ New package!`);
            isUpdate = true;
        }

        if (isUpdate) {
            fs.writeFileSync(destFile, JSON.stringify(manifest, null, 2));
            updateIndex(manifest);
        }

    } catch (error) {
        console.error(`      ❌ Failed to process ${manifestUrl}: ${error.message}`);
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
        shortName: newManifest.id.split('.').pop(),
        name: newManifest.name,
        version: newManifest.version,
        description: newManifest.description,
        author: newManifest.author,
        category: newManifest.category || 'General',
        keywords: newManifest.keywords || [],
        manifest: `packages/${newManifest.id.split('.')[0][0]}/${newManifest.id.replace('.', '/')}/nex.json`,
        repository: newManifest.repository,
        updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
        index.packages[existingIdx] = { ...index.packages[existingIdx], ...indexEntry };
    } else {
        index.packages.push(indexEntry);
    }

    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

/**
 * Delete a package
 */
function deletePackage(id) {
    console.log(`🗑️  Deleting ${id}...`);

    if (!id || !id.includes('.')) {
        console.error("Invalid ID. Format: author.package");
        process.exit(1);
    }

    // 1. Update Index
    if (fs.existsSync(INDEX_FILE)) {
        let index = JSON.parse(fs.readFileSync(INDEX_FILE));
        const initLen = index.packages.length;
        index.packages = index.packages.filter(p => p.id !== id);

        if (index.packages.length === initLen) {
            console.warn(`   ⚠️  Package ${id} not found in index.`);
        } else {
            fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
            console.log("   ✅ Removed from index.json");
        }
    }

    // 2. Remove Directory
    const [author, pkgName] = id.split('.');
    const firstLetter = author[0].toLowerCase();
    const pkgDir = path.join(REGISTRY_ROOT, firstLetter, author, pkgName);

    if (fs.existsSync(pkgDir)) {
        fs.rmSync(pkgDir, { recursive: true, force: true });
        console.log(`   ✅ Deleted directory: ${pkgDir}`);

        // Cleanup empty parent dirs if possible
        const authorDir = path.dirname(pkgDir);
        try {
            if (fs.readdirSync(authorDir).length === 0) fs.rmdirSync(authorDir);
            const letterDir = path.dirname(authorDir);
            if (fs.readdirSync(letterDir).length === 0) fs.rmdirSync(letterDir);
        } catch (e) { }
    } else {
        console.warn(`   ⚠️  Directory not found: ${pkgDir}`);
    }
}

// --- Main CLI ---
(async () => {
    const mode = process.argv[2];
    const target = process.argv[3];

    try {
        if (mode === 'add') {
            if (!target) {
                console.error("Usage: node registry-manager.js add <github_url>");
                process.exit(1);
            }

            // 1. Scan repo for ALL manifests
            const manifests = await findManifestsInRepo(target);

            // 2. Process each one
            for (const m of manifests) {
                await processManifest(m.url, target);
            }
            console.log("\nDone!");
        }
        else if (mode === 'delete') {
            if (!target) {
                console.error("Usage: node registry-manager.js delete <package_id>");
                process.exit(1);
            }
            deletePackage(target);
        }
        else if (mode === 'update-all') {
            if (!fs.existsSync(INDEX_FILE)) {
                console.log("No index to update.");
                return;
            }
            const index = JSON.parse(fs.readFileSync(INDEX_FILE));
            const repos = [...new Set(index.packages.map(p => p.repository).filter(Boolean))];

            console.log(`Checking ${repos.length} unique repositories for updates...`);

            for (const repo of repos) {
                try {
                    const manifests = await findManifestsInRepo(repo);
                    for (const m of manifests) {
                        await processManifest(m.url, repo);
                    }
                } catch (e) {
                    console.error(`Failed to scan ${repo}: ${e.message}`);
                }
            }
        }
        else {
            console.log("Unknown command. Use 'add', 'delete', or 'update-all'");
        }
    } catch (e) {
        console.error(`🔥 Fatal Error: ${e.message}`);
        process.exit(1);
    }
})();
