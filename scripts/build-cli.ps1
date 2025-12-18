# Build CLI on Windows
#
# Prerequisites:
#   - CMake 3.10+
#   - Visual Studio Build Tools or MSVC
#   - vcpkg with curl installed
#
# Usage:
#   .\scripts\build-cli.ps1

$ErrorActionPreference = "Stop"

Write-Host "Building Nex CLI..." -ForegroundColor Cyan

# Check for vcpkg
if (-not $env:VCPKG_ROOT) {
    Write-Host "Warning: VCPKG_ROOT not set. Attempting to find vcpkg..." -ForegroundColor Yellow
    
    # Common vcpkg locations
    $vcpkgPaths = @(
        "$PWD\..\vcpkg",
        "$PWD\..\..\vcpkg",
        "C:\vcpkg",
        "C:\src\vcpkg",
        "$env:USERPROFILE\vcpkg"
    )
    
    foreach ($path in $vcpkgPaths) {
        if (Test-Path "$path\vcpkg.exe") {
            $env:VCPKG_ROOT = Resolve-Path $path
            Write-Host "Found vcpkg at: $env:VCPKG_ROOT" -ForegroundColor Green
            break
        }
    }
}

if (-not $env:VCPKG_ROOT) {
    Write-Host "vcpkg not found. Please install vcpkg and set VCPKG_ROOT environment variable." -ForegroundColor Red
    Write-Host "  git clone https://github.com/microsoft/vcpkg"
    Write-Host "  .\vcpkg\bootstrap-vcpkg.bat"
    Write-Host "  .\vcpkg\vcpkg install curl:x64-windows-static"
    exit 1
}

# Navigate to CLI directory
$cliDir = Join-Path $PSScriptRoot "..\cli"
Set-Location $cliDir

# Create build directory
$buildDir = Join-Path $cliDir "build"
if (-not (Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir | Out-Null
}
Set-Location $buildDir

# Configure with CMake
Write-Host "`nConfiguring CMake..." -ForegroundColor Cyan
cmake .. -DCMAKE_TOOLCHAIN_FILE="$env:VCPKG_ROOT\scripts\buildsystems\vcpkg.cmake" `
         -DVCPKG_TARGET_TRIPLET=x64-windows-static `
         -DCMAKE_BUILD_TYPE=Release

if ($LASTEXITCODE -ne 0) {
    Write-Host "CMake configuration failed!" -ForegroundColor Red
    exit 1
}

# Build
Write-Host "`nBuilding..." -ForegroundColor Cyan
cmake --build . --config Release

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Check output
$exePath = Join-Path $buildDir "Release\nex.exe"
if (Test-Path $exePath) {
    Write-Host "`n✅ Build successful!" -ForegroundColor Green
    Write-Host "Executable: $exePath"
    
    # Show version
    & $exePath --version
} else {
    Write-Host "Build completed but executable not found!" -ForegroundColor Red
    exit 1
}
