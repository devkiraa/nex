/*
 * Install command - Download and install a package from the registry
 */

#include "nex.h"

int cmd_install(int argc, char *argv[]) {
    if (argc < 1) {
        print_error("Usage: nex install <package-id>");
        printf("Example: nex install author.package-name\n");
        return 1;
    }
    
    const char *package_id = argv[0];
    LocalPackage local;
    
    /* Check if already installed */
    if (package_is_installed(package_id, &local)) {
        print_info("Package '%s' is already installed (version %s)", package_id, local.version);
        printf("Use 'nex update %s' to update to the latest version.\n", package_id);
        return 0;
    }
    
    print_info("Installing package: %s", package_id);
    
    /* Fetch and install */
    if (package_install(package_id) != 0) {
        print_error("Failed to install package: %s", package_id);
        return 1;
    }
    
    print_success("Successfully installed: %s", package_id);
    printf("Run with: nex run %s\n", package_id);
    
    return 0;
}
