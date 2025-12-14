/*
 * Doctor command - Check system health
 */

#include "nex.h"

static int check_command(const char *cmd, const char *name) {
    printf("  %-15s ", name);
    int ret = system(cmd);
    if (ret == 0) {
        printf("\033[32m✓ Installed\033[0m\n");
        return 1;
    } else {
        printf("\033[31m✗ Not found\033[0m\n");
        return 0;
    }
}

static void check_dir(const char *path, const char *desc) {
    if (access(path, 0) == 0) { // 0 is F_OK
        printf("  \033[32m✓\033[0m %s (\033[90m%s\033[0m)\n", desc, path);
    } else {
        printf("  \033[31m✗\033[0m %s (\033[90m%s\033[0m)\n", desc, path);
    }
}

int cmd_doctor(int argc, char *argv[]) {
    (void)argc;
    (void)argv;
    
    printf("\n\033[33m🏥 Nex Doctor\033[0m\n");
    printf("\033[90mChecking your nex environment...\033[0m\n\n");
    
    /* 1. CLI Version */
    printf("\033[1m[CLI Info]\033[0m\n");
    printf("  Version         %s\n", NEX_VERSION);
#ifdef _WIN32
    printf("  Platform        Windows\n");
#elif __APPLE__
    printf("  Platform        macOS\n");
#elif __linux__
    printf("  Platform        Linux\n");
#else
    printf("  Platform        Unknown\n");
#endif
    printf("\n");
    
    /* 2. Runtimes */
    printf("\033[1m[Runtimes]\033[0m\n");
#ifdef _WIN32
    check_command("git --version >nul 2>&1", "Git");
    check_command("python --version >nul 2>&1", "Python");
    check_command("node --version >nul 2>&1", "Node.js");
#else
    check_command("git --version >/dev/null 2>&1", "Git");
    check_command("python3 --version >/dev/null 2>&1", "Python3");
    check_command("node --version >/dev/null 2>&1", "Node.js");
    check_command("bash --version >/dev/null 2>&1", "Bash");
#endif
    printf("\n");
    
    /* 3. Directories */
    printf("\033[1m[Directories]\033[0m\n");
    char path[MAX_PATH_LEN];
    
    config_get_home_dir(path, sizeof(path));
    check_dir(path, "Home Dir");
    
    config_get_packages_dir(path, sizeof(path));
    check_dir(path, "Packages");
    
    printf("\n");
    
    /* 4. Connectivity */
    printf("\033[1m[Connectivity]\033[0m\n");
    printf("  Registry        ");
    
    HttpResponse *res = http_get(REGISTRY_BASE_URL "/index.json");
    if (res && res->status_code == 200) {
        printf("\033[32m✓ Accessible\033[0m\n");
    } else {
        printf("\033[31m✗ Unreachable\033[0m\n");
        if (res) printf("    (Status: %ld)\n", res->status_code);
    }
    if (res) http_response_free(res);
    
    printf("\n");
    
    return 0;
}
