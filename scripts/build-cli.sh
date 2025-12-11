#!/bin/bash
#
# Build CLI on Linux/macOS
#
# Prerequisites:
#   - CMake 3.10+
#   - GCC/Clang
#   - libcurl-dev
#
# Usage:
#   ./scripts/build-cli.sh

set -e

echo "Building Nex CLI..."

# Navigate to CLI directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_DIR="$SCRIPT_DIR/../cli"
cd "$CLI_DIR"

# Check for dependencies
if ! command -v cmake &> /dev/null; then
    echo "Error: CMake is required but not installed."
    echo "  Ubuntu/Debian: sudo apt-get install cmake"
    echo "  macOS: brew install cmake"
    exit 1
fi

if ! command -v curl-config &> /dev/null; then
    echo "Warning: libcurl development files may not be installed."
    echo "  Ubuntu/Debian: sudo apt-get install libcurl4-openssl-dev"
    echo "  macOS: brew install curl"
fi

# Create build directory
BUILD_DIR="$CLI_DIR/build"
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

# Configure with CMake
echo ""
echo "Configuring CMake..."
cmake .. -DCMAKE_BUILD_TYPE=Release

# Build
echo ""
echo "Building..."
cmake --build . --config Release

# Check output
if [ -f "nex" ]; then
    echo ""
    echo "✅ Build successful!"
    echo "Executable: $BUILD_DIR/nex"
    
    # Show version
    ./nex --version
    
    echo ""
    echo "To install:"
    echo "  sudo cp $BUILD_DIR/nex /usr/local/bin/"
else
    echo "Build completed but executable not found!"
    exit 1
fi
