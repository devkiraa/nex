/*
 * Remove command - Uninstall a package
 */

#include "nex.h"

int cmd_remove(int argc, char *argv[]) {
    if (argc < 1) {
        print_error("Usage: nex remove <package-id>");
        printf("Example: nex remove author.package-name\n");
        return 1;
    }
    
    const char *package_id = argv[0];
    LocalPackage local;
    
    /* Check if installed */
    if (!package_is_installed(package_id, &local)) {
        print_error("Package '%s' is not installed", package_id);
        return 1;
    }
    
    print_info("Removing package: %s", package_id);
    
    if (package_remove(package_id) != 0) {
        print_error("Failed to remove package: %s", package_id);
        return 1;
    }
    
    print_success("Successfully removed: %s", package_id);
    return 0;
}
