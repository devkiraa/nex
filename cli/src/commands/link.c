/*
 * Link command - Link local package to global scope
 */

#include "nex.h"
#include "cJSON.h"

static int get_links_path(char *path, size_t size) {
    char home[MAX_PATH_LEN];
    if (config_get_home_dir(home, sizeof(home)) != 0) {
        return -1;
    }
    snprintf(path, size, "%s%clinks.json", home, PATH_SEPARATOR);
    return 0;
}

static cJSON* load_links(void) {
    char path[MAX_PATH_LEN];
    if (get_links_path(path, sizeof(path)) != 0) return cJSON_CreateObject();
    
    FILE *f = fopen(path, "r");
    if (!f) return cJSON_CreateObject();
    
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);
    
    char *data = malloc(size + 1);
    fread(data, 1, size, f);
    data[size] = '\0';
    fclose(f);
    
    cJSON *json = cJSON_Parse(data);
    free(data);
    return json ? json : cJSON_CreateObject();
}

static void save_links(cJSON *links) {
    char path[MAX_PATH_LEN];
    get_links_path(path, sizeof(path));
    
    char *str = cJSON_Print(links);
    FILE *f = fopen(path, "w");
    if (f) {
        fputs(str, f);
        fclose(f);
    }
    free(str);
}

int cmd_link(int argc, char *argv[]) {
    (void)argc;
    (void)argv;
    
    /* 1. Check for manifest.json */
    FILE *f = fopen("manifest.json", "r");
    if (!f) {
        print_error("No manifest.json found in current directory");
        return 1;
    }
    
    /* 2. Parse manifest to get ID */
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);
    
    char *data = malloc(size + 1);
    fread(data, 1, size, f);
    data[size] = '\0';
    fclose(f);
    
    cJSON *manifest = cJSON_Parse(data);
    free(data);
    
    if (!manifest) {
        print_error("Invalid manifest.json");
        return 1;
    }
    
    cJSON *id_item = cJSON_GetObjectItem(manifest, "id");
    if (!id_item || !cJSON_IsString(id_item)) {
        print_error("Manifest missing 'id' field");
        cJSON_Delete(manifest);
        return 1;
    }
    
    char *package_id = id_item->valuestring;
    char cwd[MAX_PATH_LEN];
    
#ifdef _WIN32
    if (_getcwd(cwd, sizeof(cwd)) == NULL)
#else
    if (getcwd(cwd, sizeof(cwd)) == NULL)
#endif
    {
        print_error("Failed to get current directory");
        cJSON_Delete(manifest);
        return 1;
    }
    
    /* 3. Register link */
    cJSON *links = load_links();
    
    /* Remove existing if present */
    if (cJSON_HasObjectItem(links, package_id)) {
        cJSON_DeleteItemFromObject(links, package_id);
    }
    
    cJSON_AddStringToObject(links, package_id, cwd);
    save_links(links);
    
    printf("\n  \033[32m🔗 Package Linked!\033[0m\n\n");
    printf("  \033[1m%s\033[0m -> %s\n\n", package_id, cwd);
    printf("  You can now run 'nex run %s' to use your local code.\n\n", package_id);
    
    cJSON_Delete(manifest);
    cJSON_Delete(links);
    
    return 0;
}
