#!/usr/bin/env python3
"""
Validate Nex Registry

This script validates all package manifests against the JSON schema
and checks for consistency with the index.json file.
"""

import json
import sys
from pathlib import Path

def load_json(path: Path) -> dict:
    """Load and parse a JSON file."""
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def validate_manifest(manifest_path: Path, schema: dict) -> list:
    """Validate a manifest file against the schema."""
    errors = []
    
    try:
        manifest = load_json(manifest_path)
    except json.JSONDecodeError as e:
        return [f"Invalid JSON: {e}"]
    
    # Check required fields
    required = ['id', 'name', 'version', 'description', 'repository', 'runtime', 'entrypoint']
    for field in required:
        if field not in manifest:
            errors.append(f"Missing required field: {field}")
    
    # Validate ID format
    if 'id' in manifest:
        pkg_id = manifest['id']
        if '.' not in pkg_id:
            errors.append(f"Invalid ID format: {pkg_id} (expected author.package-name)")
    
    # Validate version format
    if 'version' in manifest:
        version = manifest['version']
        parts = version.split('.')
        if len(parts) < 3:
            errors.append(f"Invalid version format: {version} (expected semver)")
    
    # Validate repository URL
    if 'repository' in manifest:
        repo = manifest['repository']
        if not repo.startswith('https://github.com/'):
            errors.append(f"Repository must be a GitHub URL: {repo}")
    
    # Validate runtime
    if 'runtime' in manifest:
        runtime = manifest['runtime']
        if isinstance(runtime, dict):
            if 'type' not in runtime:
                errors.append("Runtime missing 'type' field")
            elif runtime['type'] not in ['python', 'node', 'bash', 'powershell', 'binary', 'go']:
                errors.append(f"Invalid runtime type: {runtime['type']}")
    
    return errors

def validate_index(index_path: Path, packages_dir: Path) -> list:
    """Validate the index.json file."""
    errors = []
    
    try:
        index = load_json(index_path)
    except json.JSONDecodeError as e:
        return [f"Invalid JSON in index.json: {e}"]
    
    if 'packages' not in index:
        return ["Missing 'packages' array in index.json"]
    
    seen_ids = set()
    
    for pkg in index['packages']:
        # Check required fields
        if 'id' not in pkg:
            errors.append("Package in index missing 'id'")
            continue
        
        pkg_id = pkg['id']
        
        # Check for duplicates
        if pkg_id in seen_ids:
            errors.append(f"Duplicate package ID: {pkg_id}")
        seen_ids.add(pkg_id)
        
        # Check manifest exists
        if 'manifest' in pkg:
            manifest_path = packages_dir.parent / pkg['manifest']
            if not manifest_path.exists():
                errors.append(f"Package '{pkg_id}' references non-existent manifest: {pkg['manifest']}")
            else:
                # Verify manifest ID matches
                try:
                    manifest = load_json(manifest_path)
                    if manifest.get('id') != pkg_id:
                        errors.append(f"Package ID mismatch: index has '{pkg_id}', manifest has '{manifest.get('id')}'")
                except:
                    pass
    
    return errors

def main():
    """Main entry point."""
    # Find registry directory
    script_dir = Path(__file__).parent
    registry_dir = script_dir.parent / 'registry'
    
    if not registry_dir.exists():
        print(f"Error: Registry directory not found: {registry_dir}")
        sys.exit(1)
    
    index_path = registry_dir / 'index.json'
    schema_path = registry_dir / 'schema' / 'package.schema.json'
    packages_dir = registry_dir / 'packages'
    
    all_errors = []
    
    # Load schema
    schema = {}
    if schema_path.exists():
        try:
            schema = load_json(schema_path)
        except:
            print(f"Warning: Could not load schema from {schema_path}")
    
    # Validate index
    print("Validating index.json...")
    if index_path.exists():
        errors = validate_index(index_path, packages_dir)
        if errors:
            all_errors.extend([f"index.json: {e}" for e in errors])
            for e in errors:
                print(f"  ❌ {e}")
        else:
            print("  ✅ index.json is valid")
    else:
        all_errors.append("index.json not found")
        print("  ❌ index.json not found")
    
    # Find and validate all manifests
    print("\nValidating package manifests...")
    manifest_count = 0
    
    for manifest_path in packages_dir.rglob('manifest.json'):
        manifest_count += 1
        rel_path = manifest_path.relative_to(registry_dir)
        
        errors = validate_manifest(manifest_path, schema)
        if errors:
            all_errors.extend([f"{rel_path}: {e}" for e in errors])
            print(f"  ❌ {rel_path}")
            for e in errors:
                print(f"      {e}")
        else:
            print(f"  ✅ {rel_path}")
    
    print(f"\nValidated {manifest_count} manifest(s)")
    
    # Summary
    if all_errors:
        print(f"\n❌ Validation failed with {len(all_errors)} error(s)")
        sys.exit(1)
    else:
        print("\n✅ All validations passed!")
        sys.exit(0)

if __name__ == '__main__':
    main()
