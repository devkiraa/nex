/*
 * Install command - Download and install a package from the registry
 */

#include "nex.h"

int cmd_install(int argc, char *argv[]) {
    if (argc < 1) {
        print_error("Usage: nex install <package>");
        printf("Example: nex install pagepull\n");
        printf("         nex install devkiraa.pagepull\n");
        return 1;
    }
    
    const char *input_name = argv[0];
    char package_id[MAX_NAME_LEN];
    
    /* Resolve short name to full package ID */
    if (package_resolve_name(input_name, package_id, sizeof(package_id)) != 0) {
        return 1;
    }
    
    /* Show resolved ID if different from input */
    if (strcmp(input_name, package_id) != 0) {
        print_info("Resolved '%s' to '%s'", input_name, package_id);
    }
    
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
    
    /* Get the short name for the run command */
    const char *short_name = strchr(package_id, '.');
    short_name = short_name ? short_name + 1 : package_id;
    
    print_success("Successfully installed: %s", package_id);
    printf("Run with: nex run %s\n", short_name);
    
    return 0;
}
