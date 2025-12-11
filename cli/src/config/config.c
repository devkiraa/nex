/*
 * Configuration - Manages local config and directories
 */

#include "nex.h"
#include "cJSON.h"

#define CONFIG_FILENAME "config.json"
#define PACKAGES_DIRNAME "packages"
#define INSTALLED_FILENAME "installed.json"

int config_get_home_dir(char *buffer, size_t size) {
#ifdef _WIN32
    /* Use %USERPROFILE%\.nex */
    char *userprofile = getenv("USERPROFILE");
    if (!userprofile) {
        return -1;
    }
    snprintf(buffer, size, "%s\\.nex", userprofile);
#else
    /* Use $HOME/.nex */
    char *home = getenv("HOME");
    if (!home) {
        struct passwd *pw = getpwuid(getuid());
        if (!pw) return -1;
        home = pw->pw_dir;
    }
    snprintf(buffer, size, "%s/.nex", home);
#endif
    return 0;
}

int config_get_packages_dir(char *buffer, size_t size) {
    char home[MAX_PATH_LEN];
    if (config_get_home_dir(home, sizeof(home)) != 0) {
        return -1;
    }
    snprintf(buffer, size, "%s%c%s", home, PATH_SEPARATOR, PACKAGES_DIRNAME);
    return 0;
}

int config_init(void) {
    return config_ensure_directories();
}

int config_ensure_directories(void) {
    char home_dir[MAX_PATH_LEN];
    char packages_dir[MAX_PATH_LEN];
    
    if (config_get_home_dir(home_dir, sizeof(home_dir)) != 0) {
        return -1;
    }
    
    if (config_get_packages_dir(packages_dir, sizeof(packages_dir)) != 0) {
        return -1;
    }
    
    if (make_directory_recursive(home_dir) != 0) {
        return -1;
    }
    
    if (make_directory_recursive(packages_dir) != 0) {
        return -1;
    }
    
    return 0;
}

static int get_installed_file_path(char *buffer, size_t size) {
    char home[MAX_PATH_LEN];
    if (config_get_home_dir(home, sizeof(home)) != 0) {
        return -1;
    }
    snprintf(buffer, size, "%s%c%s", home, PATH_SEPARATOR, INSTALLED_FILENAME);
    return 0;
}

static cJSON* load_installed_json(void) {
    char path[MAX_PATH_LEN];
    if (get_installed_file_path(path, sizeof(path)) != 0) {
        return NULL;
    }
    
    FILE *f = fopen(path, "r");
    if (!f) {
        /* Return empty array if file doesn't exist */
        return cJSON_CreateArray();
    }
    
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);
    
    char *json_str = malloc(size + 1);
    if (!json_str) {
        fclose(f);
        return NULL;
    }
    
    fread(json_str, 1, size, f);
    json_str[size] = '\0';
    fclose(f);
    
    cJSON *json = cJSON_Parse(json_str);
    free(json_str);
    
    if (!json || !cJSON_IsArray(json)) {
        if (json) cJSON_Delete(json);
        return cJSON_CreateArray();
    }
    
    return json;
}

static int save_installed_json(cJSON *json) {
    char path[MAX_PATH_LEN];
    if (get_installed_file_path(path, sizeof(path)) != 0) {
        return -1;
    }
    
    char *json_str = cJSON_Print(json);
    if (!json_str) {
        return -1;
    }
    
    FILE *f = fopen(path, "w");
    if (!f) {
        free(json_str);
        return -1;
    }
    
    fputs(json_str, f);
    fclose(f);
    free(json_str);
    
    return 0;
}

int config_save_local_package(const LocalPackage *pkg) {
    cJSON *installed = load_installed_json();
    if (!installed) {
        return -1;
    }
    
    /* Remove existing entry if present */
    cJSON *item;
    int idx = 0;
    cJSON_ArrayForEach(item, installed) {
        cJSON *id = cJSON_GetObjectItemCaseSensitive(item, "id");
        if (cJSON_IsString(id) && strcmp(id->valuestring, pkg->id) == 0) {
            cJSON_DeleteItemFromArray(installed, idx);
            break;
        }
        idx++;
    }
    
    /* Add new entry */
    cJSON *entry = cJSON_CreateObject();
    cJSON_AddStringToObject(entry, "id", pkg->id);
    cJSON_AddStringToObject(entry, "version", pkg->version);
    cJSON_AddStringToObject(entry, "path", pkg->install_path);
    cJSON_AddItemToArray(installed, entry);
    
    int result = save_installed_json(installed);
    cJSON_Delete(installed);
    
    return result;
}

int config_remove_local_package(const char *package_id) {
    cJSON *installed = load_installed_json();
    if (!installed) {
        return -1;
    }
    
    cJSON *item;
    int idx = 0;
    int found = 0;
    cJSON_ArrayForEach(item, installed) {
        cJSON *id = cJSON_GetObjectItemCaseSensitive(item, "id");
        if (cJSON_IsString(id) && strcmp(id->valuestring, package_id) == 0) {
            cJSON_DeleteItemFromArray(installed, idx);
            found = 1;
            break;
        }
        idx++;
    }
    
    if (found) {
        save_installed_json(installed);
    }
    
    cJSON_Delete(installed);
    return found ? 0 : -1;
}

int config_list_installed(LocalPackage **packages, int *count) {
    cJSON *installed = load_installed_json();
    if (!installed) {
        return -1;
    }
    
    int n = cJSON_GetArraySize(installed);
    *count = n;
    
    if (n == 0) {
        *packages = NULL;
        cJSON_Delete(installed);
        return 0;
    }
    
    *packages = calloc(n, sizeof(LocalPackage));
    if (!*packages) {
        cJSON_Delete(installed);
        return -1;
    }
    
    int i = 0;
    cJSON *item;
    cJSON_ArrayForEach(item, installed) {
        cJSON *id = cJSON_GetObjectItemCaseSensitive(item, "id");
        cJSON *version = cJSON_GetObjectItemCaseSensitive(item, "version");
        cJSON *path = cJSON_GetObjectItemCaseSensitive(item, "path");
        
        if (cJSON_IsString(id)) {
            strncpy((*packages)[i].id, id->valuestring, MAX_NAME_LEN - 1);
        }
        if (cJSON_IsString(version)) {
            strncpy((*packages)[i].version, version->valuestring, MAX_VERSION_LEN - 1);
        }
        if (cJSON_IsString(path)) {
            strncpy((*packages)[i].install_path, path->valuestring, MAX_PATH_LEN - 1);
        }
        (*packages)[i].is_installed = 1;
        i++;
    }
    
    cJSON_Delete(installed);
    return 0;
}
