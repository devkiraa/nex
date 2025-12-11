# Contributing to Nex

Thank you for your interest in contributing to Nex! This document provides guidelines and instructions for contributing.

## Ways to Contribute

1. **Submit a Package** - Add your tool to the registry
2. **Improve the CLI** - Enhance the C codebase
3. **Enhance the Frontend** - Improve the web interface
4. **Documentation** - Help improve our docs
5. **Bug Reports** - Report issues you find

## Development Setup

### CLI Development

**Prerequisites:**
- CMake 3.10+
- C compiler (MSVC, GCC, or Clang)
- libcurl development files

**Building:**

```bash
cd cli
mkdir build && cd build
cmake ..
cmake --build . --config Release
```

**Windows with vcpkg:**

```powershell
vcpkg install curl:x64-windows-static
cd cli
mkdir build && cd build
cmake .. -DCMAKE_TOOLCHAIN_FILE=[vcpkg-root]/scripts/buildsystems/vcpkg.cmake
cmake --build . --config Release
```

### Frontend Development

**Prerequisites:**
- Node.js 18+
- npm or pnpm

**Setup:**

```bash
cd frontend
npm install
npm run dev
```

### Registry Validation

```bash
cd scripts
python validate-registry.py
```

## Package Submission Guidelines

1. **Unique ID**: Use format `author.package-name` (lowercase, hyphens only)
2. **Valid Repository**: Must be a public GitHub repository
3. **Working Tool**: The tool must actually work when installed
4. **Appropriate Content**: No malware, spam, or inappropriate content
5. **License**: Include a license in your tool's repository

## Code Style

### C Code
- Use 4-space indentation
- Keep functions under 50 lines when possible
- Comment complex logic
- Use descriptive variable names

### JavaScript/TypeScript
- Use ESLint and Prettier
- Prefer functional components in Astro

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Questions?

Open an issue with the "question" label!
