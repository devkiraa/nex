/*
 * Update command - Update package(s) to the latest version
 */

#include "nex.h"

int cmd_update(int argc, char *argv[]) {
    if (argc < 1) {
        /* Update all packages */
        print_info("Checking for updates...");
        
        /* First, check for nex CLI updates */
        int cli_update_available = 0;
        char latest_cli_version[MAX_VERSION_LEN];
        if (nex_check_for_updates(&cli_update_available, latest_cli_version, sizeof(latest_cli_version)) == 0) {
            if (cli_update_available) {
                printf("\n");
                print_info("New nex version available: %s -> %s", NEX_VERSION, latest_cli_version);
                printf("Run 'nex self-update' to update the CLI.\n\n");
            }
        }
        
        LocalPackage *packages = NULL;
        int count = 0;
        
        if (config_list_installed(&packages, &count) != 0) {
            print_error("Failed to list installed packages");
            return 1;
        }
        
        if (count == 0) {
            print_info("No packages installed");
            return 0;
        }
        
        int updated = 0;
        for (int i = 0; i < count; i++) {
            PackageInfo info;
            if (package_fetch_manifest(packages[i].id, &info) == 0) {
                if (strcmp(info.version, packages[i].version) != 0) {
                    print_info("Updating %s: %s -> %s", 
                        packages[i].id, packages[i].version, info.version);
                    
                    /* Remove old, install new */
                    package_remove(packages[i].id);
                    if (package_install(packages[i].id) == 0) {
                        updated++;
                    }
                }
            }
        }
        
        free(packages);
        
        if (updated > 0) {
            print_success("Updated %d package(s)", updated);
        } else {
            print_info("All packages are up to date");
        }
        
        return 0;
    }
    
    /* Update specific package */
    const char *package_id = argv[0];
    LocalPackage local;
    
    if (!package_is_installed(package_id, &local)) {
        print_error("Package '%s' is not installed", package_id);
        return 1;
    }
    
    PackageInfo info;
    if (package_fetch_manifest(package_id, &info) != 0) {
        print_error("Failed to fetch package info");
        return 1;
    }
    
    if (strcmp(info.version, local.version) == 0) {
        print_info("Package '%s' is already at the latest version (%s)", package_id, info.version);
        return 0;
    }
    
    print_info("Updating %s: %s -> %s", package_id, local.version, info.version);
    
    /* Remove old version */
    if (package_remove(package_id) != 0) {
        print_error("Failed to remove old version");
        return 1;
    }
    
    /* Install new version */
    if (package_install(package_id) != 0) {
        print_error("Failed to install new version");
        return 1;
    }
    
    print_success("Successfully updated: %s", package_id);
    return 0;
}
