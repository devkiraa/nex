/*
 * Runtime Management - Detect, install, and manage runtimes
 */

#include "nex.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* Check if a command exists in PATH */
static int command_exists(const char *cmd) {
    char check_cmd[MAX_COMMAND_LEN];
    
#ifdef _WIN32
    snprintf(check_cmd, sizeof(check_cmd), "where %s >nul 2>&1", cmd);
#else
    snprintf(check_cmd, sizeof(check_cmd), "which %s >/dev/null 2>&1", cmd);
#endif
    
    return system(check_cmd) == 0;
}

/* Get version of a runtime */
static int get_runtime_version(const char *cmd, const char *version_flag, char *version, size_t size) {
    char check_cmd[MAX_COMMAND_LEN];
    FILE *fp;
    
#ifdef _WIN32
    snprintf(check_cmd, sizeof(check_cmd), "%s %s 2>nul", cmd, version_flag);
    fp = _popen(check_cmd, "r");
#else
    snprintf(check_cmd, sizeof(check_cmd), "%s %s 2>/dev/null", cmd, version_flag);
    fp = popen(check_cmd, "r");
#endif
    
    if (!fp) {
        return -1;
    }
    
    if (fgets(version, (int)size, fp) == NULL) {
#ifdef _WIN32
        _pclose(fp);
#else
        pclose(fp);
#endif
        return -1;
    }
    
#ifdef _WIN32
    _pclose(fp);
#else
    pclose(fp);
#endif
    
    /* Remove trailing newline */
    size_t len = strlen(version);
    if (len > 0 && version[len - 1] == '\n') {
        version[len - 1] = '\0';
    }
    
    return 0;
}

int runtime_is_installed(RuntimeType runtime) {
    switch (runtime) {
        case RUNTIME_PYTHON:
            /* Try python3 first, then python */
            if (command_exists("python3")) return 1;
            if (command_exists("python")) {
                /* Verify it's Python 3 */
                char version[64];
                if (get_runtime_version("python", "--version", version, sizeof(version)) == 0) {
                    if (strstr(version, "Python 3") != NULL) {
                        return 1;
                    }
                }
            }
            return 0;
            
        case RUNTIME_NODE:
            return command_exists("node");
            
        case RUNTIME_BASH:
            return command_exists("bash");
            
        case RUNTIME_POWERSHELL:
#ifdef _WIN32
            return command_exists("powershell");
#else
            return command_exists("pwsh");
#endif
            
        case RUNTIME_BINARY:
            return 1;  /* Always available */
            
        default:
            return 0;
    }
}

const char* runtime_get_install_instructions(RuntimeType runtime) {
    switch (runtime) {
        case RUNTIME_PYTHON:
#ifdef _WIN32
            return "Visit https://www.python.org/downloads/ or run:\n"
                   "  winget install Python.Python.3.12";
#elif __APPLE__
            return "Run: brew install python3\n"
                   "Or visit: https://www.python.org/downloads/";
#else
            return "Run: sudo apt install python3 python3-pip\n"
                   "Or: sudo dnf install python3 python3-pip";
#endif
            
        case RUNTIME_NODE:
#ifdef _WIN32
            return "Visit https://nodejs.org/ or run:\n"
                   "  winget install OpenJS.NodeJS.LTS";
#elif __APPLE__
            return "Run: brew install node\n"
                   "Or visit: https://nodejs.org/";
#else
            return "Run: sudo apt install nodejs npm\n"
                   "Or use nvm: https://github.com/nvm-sh/nvm";
#endif
            
        case RUNTIME_BASH:
#ifdef _WIN32
            return "Install Git Bash from https://git-scm.com/\n"
                   "Or use WSL: wsl --install";
#else
            return "Bash is usually pre-installed on Unix systems.";
#endif
            
        case RUNTIME_POWERSHELL:
#ifdef _WIN32
            return "PowerShell is included with Windows.";
#else
            return "Run: sudo apt install powershell\n"
                   "Or: brew install powershell";
#endif
            
        default:
            return "Unknown runtime.";
    }
}

int runtime_prompt_install(RuntimeType runtime) {
    const char *runtime_name = runtime_to_string(runtime);
    
    printf("\n");
    print_info("This package requires %s, which is not installed.", runtime_name);
    printf("\n");
    
#ifdef _WIN32
    printf("Would you like nex to install %s for you? [Y/n] ", runtime_name);
#else
    printf("Would you like nex to install %s for you? [y/N] ", runtime_name);
#endif
    
    fflush(stdout);
    
    int c = getchar();
    /* Clear input buffer */
    while (getchar() != '\n' && !feof(stdin));
    
#ifdef _WIN32
    /* Default to Yes on Windows */
    if (c == 'n' || c == 'N') {
        return 0;
    }
    return 1;
#else
    /* Default to No on Unix (requires explicit Yes) */
    if (c == 'y' || c == 'Y') {
        return 1;
    }
    return 0;
#endif
}

int runtime_install(RuntimeType runtime) {
    print_info("Installing %s...", runtime_to_string(runtime));
    
    int result = -1;
    
    switch (runtime) {
        case RUNTIME_PYTHON:
            result = runtime_install_python();
            break;
            
        case RUNTIME_NODE:
            result = runtime_install_node();
            break;
            
        default:
            print_error("Automatic installation not supported for %s", runtime_to_string(runtime));
            printf("\nManual installation:\n%s\n", runtime_get_install_instructions(runtime));
            return -1;
    }
    
    if (result == 0) {
        print_success("%s installed successfully!", runtime_to_string(runtime));
        print_info("You may need to restart your terminal for changes to take effect.");
    }
    
    return result;
}

int runtime_install_python(void) {
#ifdef _WIN32
    print_info("Downloading Python installer...");
    
    /* Download Python installer using curl */
    const char *python_url = "https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe";
    const char *installer_path = "%TEMP%\\python_installer.exe";
    
    char cmd[MAX_COMMAND_LEN];
    snprintf(cmd, sizeof(cmd), 
        "curl -L -o %s %s && "
        "%s /quiet InstallAllUsers=0 PrependPath=1 Include_test=0",
        installer_path, python_url, installer_path);
    
    int result = system(cmd);
    
    if (result != 0) {
        print_error("Failed to install Python automatically.");
        printf("\nPlease install manually:\n");
        printf("  1. Visit https://www.python.org/downloads/\n");
        printf("  2. Download and run the installer\n");
        printf("  3. Make sure to check 'Add Python to PATH'\n");
        return -1;
    }
    
    return 0;
    
#elif __APPLE__
    /* Check for Homebrew */
    if (!command_exists("brew")) {
        print_error("Homebrew is not installed.");
        printf("\nInstall Homebrew first:\n");
        printf("  /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"\n");
        printf("\nThen run: brew install python3\n");
        return -1;
    }
    
    return system("brew install python3");
    
#else
    /* Linux - try apt first, then dnf */
    if (command_exists("apt")) {
        print_info("Installing via apt...");
        return system("sudo apt update && sudo apt install -y python3 python3-pip python3-venv");
    }
    
    if (command_exists("dnf")) {
        print_info("Installing via dnf...");
        return system("sudo dnf install -y python3 python3-pip");
    }
    
    if (command_exists("pacman")) {
        print_info("Installing via pacman...");
        return system("sudo pacman -S --noconfirm python python-pip");
    }
    
    print_error("Could not detect package manager.");
    printf("\nPlease install Python manually using your system's package manager.\n");
    return -1;
#endif
}

int runtime_install_node(void) {
#ifdef _WIN32
    print_info("Downloading Node.js installer...");
    
    const char *node_url = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi";
    const char *installer_path = "%TEMP%\\node_installer.msi";
    
    char cmd[MAX_COMMAND_LEN];
    snprintf(cmd, sizeof(cmd),
        "curl -L -o %s %s && "
        "msiexec /i %s /quiet /norestart",
        installer_path, node_url, installer_path);
    
    int result = system(cmd);
    
    if (result != 0) {
        print_error("Failed to install Node.js automatically.");
        printf("\nPlease install manually:\n");
        printf("  1. Visit https://nodejs.org/\n");
        printf("  2. Download and run the LTS installer\n");
        return -1;
    }
    
    return 0;
    
#elif __APPLE__
    if (!command_exists("brew")) {
        print_error("Homebrew is not installed.");
        printf("\nInstall Homebrew first, then run: brew install node\n");
        return -1;
    }
    
    return system("brew install node");
    
#else
    /* Linux - use NodeSource repository for latest LTS */
    if (command_exists("apt")) {
        print_info("Installing Node.js via apt (NodeSource)...");
        return system(
            "curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && "
            "sudo apt install -y nodejs"
        );
    }
    
    if (command_exists("dnf")) {
        print_info("Installing via dnf...");
        return system("sudo dnf install -y nodejs npm");
    }
    
    if (command_exists("pacman")) {
        print_info("Installing via pacman...");
        return system("sudo pacman -S --noconfirm nodejs npm");
    }
    
    print_error("Could not detect package manager.");
    printf("\nPlease install Node.js manually or use nvm:\n");
    printf("  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash\n");
    printf("  nvm install --lts\n");
    return -1;
#endif
}

int runtime_ensure_available(RuntimeType runtime) {
    if (runtime == RUNTIME_BINARY || runtime == RUNTIME_UNKNOWN) {
        return 0;  /* No runtime check needed */
    }
    
    if (runtime_is_installed(runtime)) {
        return 0;  /* Already installed */
    }
    
    /* Runtime not installed - prompt user */
    if (runtime_prompt_install(runtime)) {
        if (runtime_install(runtime) == 0) {
            /* Verify installation */
            if (runtime_is_installed(runtime)) {
                return 0;
            }
            print_error("Installation completed but runtime not found in PATH.");
            print_info("Please restart your terminal and try again.");
            return -1;
        }
        return -1;
    }
    
    /* User declined - show manual instructions */
    printf("\nManual installation instructions:\n%s\n\n", 
           runtime_get_install_instructions(runtime));
    return -1;
}
