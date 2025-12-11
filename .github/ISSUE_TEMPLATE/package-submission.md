---
name: Package Submission
about: Submit a new package to the Nex registry
title: '[PACKAGE] '
labels: ['package-submission']
assignees: ''
---

## Package Information

**Package ID:** `author.package-name`

**Package Name:** 

**Description:** 

**Repository URL:** https://github.com/...

**Runtime:** (python/node/bash/powershell/binary/go)

## Checklist

- [ ] Package ID follows the `author.package-name` format
- [ ] Repository is public on GitHub
- [ ] Package includes a working entrypoint
- [ ] manifest.json follows the schema
- [ ] Package has appropriate license
- [ ] I have tested the package works with `nex install` and `nex run`

## Manifest Preview

```json
{
  "id": "author.package-name",
  "name": "Package Name",
  "version": "1.0.0",
  "description": "...",
  "repository": "https://github.com/...",
  "runtime": {
    "type": "python",
    "version": ">=3.8"
  },
  "entrypoint": "main.py",
  "commands": {
    "default": "python main.py"
  }
}
```

## Additional Notes

(Any additional information about your package)
