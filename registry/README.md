# Registry

This directory contains the package registry for Nex. All package manifests are stored here and indexed for discovery.

## Structure

```
registry/
├── index.json                    # Master index of all packages
├── schema/
│   └── package.schema.json       # JSON Schema for package manifests
└── packages/
    └── <first-letter>/           # Alphabetical organization
        └── <author>/
            └── <package-name>/
                └── manifest.json # Package manifest
```

## Adding a Package

1. Create a directory for your package following the structure above
2. Add a `manifest.json` file following the schema
3. Update `index.json` with your package entry
4. Submit a Pull Request

## Package ID Format

Package IDs must follow the format: `author.package-name`

- Use lowercase letters, numbers, and hyphens only
- Author is typically your GitHub username
- Package name should be descriptive

Examples:
- `john.image-converter`
- `acme.data-utils`
- `dev.cli-helper`

## Manifest Fields

See `schema/package.schema.json` for the full schema. Required fields:

- `id` - Unique package identifier
- `name` - Display name
- `version` - Semantic version
- `description` - Short description
- `repository` - GitHub repository URL
- `runtime` - Runtime type and version
- `entrypoint` - Main file to execute
