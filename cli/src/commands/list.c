/*
 * List command - Show installed packages
 */

#include "nex.h"

int cmd_list(int argc, char *argv[]) {
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
        printf("Run 'nex search <query>' to find packages.\n");
        return 0;
    }
    
    printf("Installed packages:\n\n");
    printf("%-40s %-15s\n", "PACKAGE", "VERSION");
    printf("%-40s %-15s\n", "-------", "-------");
    
    for (int i = 0; i < count; i++) {
        printf("%-40s %-15s\n", packages[i].id, packages[i].version);
    }
    
    printf("\nTotal: %d package(s)\n", count);
    
    free(packages);
    return 0;
}
