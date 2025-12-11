#!/usr/bin/env python3
"""
Generate Index

This script regenerates the registry/index.json file by scanning
all package manifests in the registry/packages directory.
"""

import json
from datetime import datetime, timezone
from pathlib import Path

def load_json(path: Path) -> dict:
    """Load and parse a JSON file."""
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path: Path, data: dict):
    """Save data to a JSON file."""
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
        f.write('\n')

def main():
    """Main entry point."""
    script_dir = Path(__file__).parent
    registry_dir = script_dir.parent / 'registry'
    packages_dir = registry_dir / 'packages'
    index_path = registry_dir / 'index.json'
    
    packages = []
    
    print("Scanning for package manifests...")
    
    for manifest_path in sorted(packages_dir.rglob('manifest.json')):
        try:
            manifest = load_json(manifest_path)
            
            # Get relative path for manifest reference
            rel_path = manifest_path.relative_to(registry_dir)
            
            # Extract index entry
            entry = {
                'id': manifest.get('id', 'unknown'),
                'name': manifest.get('name', manifest.get('id', 'Unknown')),
                'version': manifest.get('version', '0.0.0'),
                'description': manifest.get('description', ''),
                'keywords': manifest.get('keywords', []),
                'manifest': str(rel_path).replace('\\', '/')
            }
            
            packages.append(entry)
            print(f"  ✅ {entry['id']}")
            
        except Exception as e:
            print(f"  ❌ Error loading {manifest_path}: {e}")
    
    # Sort by ID
    packages.sort(key=lambda p: p['id'])
    
    # Create index
    index = {
        'version': '1.0',
        'updated': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'packages': packages
    }
    
    # Save
    save_json(index_path, index)
    print(f"\n✅ Generated index.json with {len(packages)} package(s)")

if __name__ == '__main__':
    main()
