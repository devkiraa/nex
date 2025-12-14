/*
 * Info command - Show package details
 */

#include "nex.h"

int cmd_info(int argc, char *argv[]) {
    if (argc < 1) {
        print_error("Usage: nex info <package>");
        printf("Example: nex info pagepull\n");
        return 1;
    }
    
    const char *input_name = argv[0];
    char package_id[MAX_NAME_LEN];
    
    /* Resolve short name to full package ID */
    if (package_resolve_name(input_name, package_id, sizeof(package_id)) != 0) {
        return 1;
    }
    
    PackageInfo info;
    
    if (package_fetch_manifest(package_id, &info) != 0) {
        print_error("Package '%s' not found in registry", package_id);
        return 1;
    }
    
    printf("\n");
    printf("Package: %s\n", info.name);
    printf("ID:      %s\n", info.id);
    printf("Version: %s\n", info.version);
    printf("Author:  %s\n", info.author);
    printf("\n");
    printf("Description:\n  %s\n", info.description);
    printf("\n");
    printf("Runtime: %s", runtime_to_string(info.runtime));
    if (strlen(info.runtime_version) > 0) {
        printf(" %s", info.runtime_version);
    }
    printf("\n");
    printf("Repository: %s\n", info.repository);
    printf("\n");
    
    if (info.command_count > 0) {
        printf("Commands:\n");
        for (int i = 0; i < info.command_count; i++) {
            printf("  %s: %s\n", info.commands[i].name, info.commands[i].command);
        }
        printf("\n");
    }
    
    if (info.keyword_count > 0) {
        printf("Keywords: ");
        for (int i = 0; i < info.keyword_count; i++) {
            if (i > 0) printf(", ");
            printf("%s", info.keywords[i]);
        }
        printf("\n\n");
    }
    
    /* Check if installed locally */
    LocalPackage local;
    if (package_is_installed(package_id, &local)) {
        printf("Status: Installed (version %s)\n", local.version);
        printf("Location: %s\n", local.install_path);
    } else {
        printf("Status: Not installed\n");
        printf("Install with: nex install %s\n", package_id);
    }
    
    printf("\n");
    return 0;
}
