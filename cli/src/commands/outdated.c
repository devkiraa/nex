/*
 * Outdated command - Check for package updates
 */

#include "nex.h"

int cmd_outdated(int argc, char *argv[]) {
    (void)argc;
    (void)argv;
    
    LocalPackage *packages = NULL;
    int count = 0;
    
    if (config_list_installed(&packages, &count) != 0) {
        print_error("Failed to list installed packages");
        return 1;
    }
    
    if (count == 0) {
        printf("No packages installed.\n");
        return 0;
    }
    
    printf("\n\033[1mComparing installed packages with registry...\033[0m\n\n");
    printf("%-25s %-15s %-15s\n", "PACKAGE", "CURRENT", "LATEST");
    printf("%-25s %-15s %-15s\n", "-------", "-------", "------");
    
    int outdated_count = 0;
    
    for (int i = 0; i < count; i++) {
        /* Extract short name */
        const char *short_name = strchr(packages[i].id, '.');
        short_name = short_name ? short_name + 1 : packages[i].id;
        
        /* Fetch latest manifest */
        PackageInfo latest;
        memset(&latest, 0, sizeof(latest));
        
        printf("Checking %s...\r", short_name);
        fflush(stdout);
        
        if (package_fetch_manifest(packages[i].id, &latest) == 0) {
            /* Compare versions (simple string comparison for now) */
            if (strcmp(packages[i].version, latest.version) != 0) {
                printf("%-25s \033[90m%-15s\033[0m \033[32m%-15s\033[0m\n", 
                    short_name, packages[i].version, latest.version);
                outdated_count++;
            }
        }
    }
    
    /* Clear progress line */
    printf("                                                 \r");
    
    if (outdated_count == 0) {
        printf("\n\033[32mAll packages are up to date! 🎉\033[0m\n\n");
    } else {
        printf("\n\033[33m%d package(s) have updates available.\033[0m\n", outdated_count);
        printf("Run 'nex update' to upgrade them.\n\n");
    }
    
    free(packages);
    return 0;
}
