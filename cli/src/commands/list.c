/*
 * List command - Show installed packages
 */

#include "nex.h"
#include <sys/stat.h>

/* Get directory size recursively */
static long get_dir_size(const char *path) {
#ifdef _WIN32
    /* Simplified for Windows - just return 0 */
    (void)path;
    return 0;
#else
    char cmd[MAX_PATH_LEN + 50];
    snprintf(cmd, sizeof(cmd), "du -sb \"%s\" 2>/dev/null | cut -f1", path);
    
    FILE *fp = popen(cmd, "r");
    if (!fp) return 0;
    
    long size = 0;
    if (fscanf(fp, "%ld", &size) != 1) size = 0;
    pclose(fp);
    
    return size;
#endif
}

/* Format size to human readable */
static void format_size(long bytes, char *buf, size_t size) {
    if (bytes < 1024) {
        snprintf(buf, size, "%ld B", bytes);
    } else if (bytes < 1024 * 1024) {
        snprintf(buf, size, "%.1f KB", bytes / 1024.0);
    } else if (bytes < 1024 * 1024 * 1024) {
        snprintf(buf, size, "%.1f MB", bytes / (1024.0 * 1024.0));
    } else {
        snprintf(buf, size, "%.1f GB", bytes / (1024.0 * 1024.0 * 1024.0));
    }
}

int cmd_list(int argc, char *argv[]) {
    int verbose = 0;
    
    /* Check for verbose flag */
    for (int i = 0; i < argc; i++) {
        if (strcmp(argv[i], "-v") == 0 || strcmp(argv[i], "--verbose") == 0) {
            verbose = 1;
        }
    }
    
    LocalPackage *packages = NULL;
    int count = 0;
    
    if (config_list_installed(&packages, &count) != 0) {
        print_error("Failed to list installed packages");
        return 1;
    }
    
    if (count == 0) {
        printf("\n\033[33mNo packages installed.\033[0m\n\n");
        printf("Get started:\n");
        printf("  nex search <query>     Search for packages\n");
        printf("  nex install <package>  Install a package\n\n");
        return 0;
    }
    
    printf("\n\033[33m📦 Installed Packages:\033[0m\n\n");
    
    long total_size = 0;
    
    for (int i = 0; i < count; i++) {
        /* Extract short name from full ID (after the dot) */
        const char *short_name = strchr(packages[i].id, '.');
        short_name = short_name ? short_name + 1 : packages[i].id;
        
        /* Read manifest to get more info */
        char manifest_path[MAX_PATH_LEN];
        snprintf(manifest_path, sizeof(manifest_path), "%s%cmanifest.json",
            packages[i].install_path, PATH_SEPARATOR);
        
        PackageInfo info;
        memset(&info, 0, sizeof(info));
        
        FILE *f = fopen(manifest_path, "r");
        if (f) {
            fseek(f, 0, SEEK_END);
            long size = ftell(f);
            fseek(f, 0, SEEK_SET);
            
            char *json = malloc(size + 1);
            if (json) {
                fread(json, 1, size, f);
                json[size] = '\0';
                package_parse_manifest(json, &info);
                free(json);
            }
            fclose(f);
        }
        
        /* Get package size */
        long pkg_size = get_dir_size(packages[i].install_path);
        total_size += pkg_size;
        char size_str[32];
        format_size(pkg_size, size_str, sizeof(size_str));
        
        /* Runtime icon */
        const char *runtime_icon = "📦";
        if (info.runtime == RUNTIME_PYTHON) runtime_icon = "🐍";
        else if (info.runtime == RUNTIME_NODE) runtime_icon = "💚";
        else if (info.runtime == RUNTIME_BASH) runtime_icon = "🐚";
        else if (info.runtime == RUNTIME_POWERSHELL) runtime_icon = "⚡";
        
        /* Print package info */
        printf("  %s \033[1m%s\033[0m \033[90mv%s\033[0m", runtime_icon, short_name, info.version[0] ? info.version : packages[i].version);
        
        if (pkg_size > 0) {
            printf(" \033[90m(%s)\033[0m", size_str);
        }
        printf("\n");
        
        if (verbose) {
            if (strlen(info.description) > 0) {
                /* Truncate description if too long */
                char desc[80];
                strncpy(desc, info.description, 75);
                desc[75] = '\0';
                if (strlen(info.description) > 75) strcat(desc, "...");
                printf("     \033[90m%s\033[0m\n", desc);
            }
            printf("     \033[90mRuntime: %s | ID: %s\033[0m\n", 
                runtime_to_string(info.runtime), packages[i].id);
            printf("     \033[90mPath: %s\033[0m\n\n", packages[i].install_path);
        }
    }
    
    /* Summary */
    char total_size_str[32];
    format_size(total_size, total_size_str, sizeof(total_size_str));
    
    printf("\n\033[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m\n");
    printf("  Total: \033[1m%d\033[0m package(s)", count);
    if (total_size > 0) {
        printf(" • %s", total_size_str);
    }
    printf("\n");
    
    if (!verbose) {
        printf("  \033[90mUse 'nex list -v' for more details\033[0m\n");
    }
    printf("\n");
    
    free(packages);
    return 0;
}
