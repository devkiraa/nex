# CLI Build

Build the Nex CLI executable.

## Prerequisites

- CMake 3.10+
- C compiler (MSVC, GCC, or Clang)
- libcurl with development headers

### Windows with vcpkg

```powershell
# Install vcpkg if not already installed
git clone https://github.com/microsoft/vcpkg
cd vcpkg
.\bootstrap-vcpkg.bat

# Install curl
.\vcpkg install curl:x64-windows-static

# Set environment variable
$env:VCPKG_ROOT = "C:\path\to\vcpkg"
```

### Ubuntu/Debian

```bash
sudo apt-get install build-essential cmake libcurl4-openssl-dev
```

### macOS

```bash
brew install cmake curl
```

## Building

### With CMake

```bash
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

### With vcpkg on Windows

```powershell
mkdir build
cd build
cmake .. -DCMAKE_TOOLCHAIN_FILE=$env:VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake
cmake --build . --config Release
```

## Output

The executable will be created at:
- Windows: `build/Release/nex.exe`
- Linux/macOS: `build/nex`

## Installation

Copy the executable to a directory in your PATH:

### Windows
```powershell
copy build\Release\nex.exe C:\Windows\System32\
# Or add to a custom directory in PATH
```

### Linux/macOS
```bash
sudo cp build/nex /usr/local/bin/
```

## Updating

Nex can update itself to the latest version:

```bash
nex self-update
```

This will:
1. Check the GitHub releases for the latest version
2. Download the appropriate binary for your platform
3. Replace the current executable with the new version

You can also check for updates when updating packages:

```bash
nex update
```

This will notify you if a new CLI version is available.
