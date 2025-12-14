/*
 * Lock command - Generate lockfile
 */

#include "nex.h"
#include "cJSON.h"
#include <time.h>

int cmd_lock(int argc, char *argv[]) {
    (void)argc;
    (void)argv;
    
    LocalPackage *packages = NULL;
    int count = 0;
    
    if (config_list_installed(&packages, &count) != 0) {
        print_error("Failed to list packages");
        return 1;
    }
    
    if (count == 0) {
        printf("No packages installed to lock.\n");
        return 0;
    }
    
    cJSON *root = cJSON_CreateObject();
    
    /* Metadata */
    cJSON_AddStringToObject(root, "generated_by", "nex " NEX_VERSION);
    
    time_t now = time(NULL);
    char date[64];
    strftime(date, sizeof(date), "%Y-%m-%dT%H:%M:%SZ", gmtime(&now));
    cJSON_AddStringToObject(root, "generated_at", date);
    
    cJSON *pkgs = cJSON_CreateObject();
    cJSON_AddItemToObject(root, "packages", pkgs);
    
    for (int i = 0; i < count; i++) {
        cJSON *p = cJSON_CreateObject();
        cJSON_AddStringToObject(p, "version", packages[i].version);
        cJSON_AddStringToObject(p, "path", packages[i].install_path);
        cJSON_AddItemToObject(pkgs, packages[i].id, p);
    }
    
    char *str = cJSON_Print(root);
    FILE *f = fopen("nex.lock", "w");
    if (f) {
        fputs(str, f);
        fclose(f);
        printf("\n  \033[32m🔒 Lockfile Generated: nex.lock\033[0m\n\n");
        printf("  Contains %d packages.\n", count);
    } else {
        print_error("Failed to write nex.lock");
    }
    
    free(str);
    cJSON_Delete(root);
    free(packages);
    
    return 0;
}
