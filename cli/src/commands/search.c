/*
 * Search command - Search the package registry
 */

#include "nex.h"
#include "cJSON.h"

int cmd_search(int argc, char *argv[]) {
    if (argc < 1) {
        print_error("Usage: nex search <query>");
        printf("Example: nex search \"python utility\"\n");
        return 1;
    }
    
    /* Combine all args into search query */
    char query[MAX_COMMAND_LEN] = {0};
    for (int i = 0; i < argc; i++) {
        if (i > 0) strcat(query, " ");
        strcat(query, argv[i]);
    }
    
    /* Convert query to lowercase for case-insensitive search */
    char query_lower[MAX_COMMAND_LEN];
    for (size_t i = 0; i < strlen(query) + 1; i++) {
        query_lower[i] = (char)tolower((unsigned char)query[i]);
    }
    
    print_info("Searching for: %s", query);
    
    /* Fetch index */
    HttpResponse *response = http_get(REGISTRY_INDEX_URL);
    if (!response || response->status_code != 200) {
        print_error("Failed to fetch package index");
        if (response) http_response_free(response);
        return 1;
    }
    
    /* Parse JSON */
    cJSON *json = cJSON_Parse(response->data);
    http_response_free(response);
    
    if (!json) {
        print_error("Failed to parse package index");
        return 1;
    }
    
    cJSON *packages = cJSON_GetObjectItemCaseSensitive(json, "packages");
    if (!cJSON_IsArray(packages)) {
        print_error("Invalid index format");
        cJSON_Delete(json);
        return 1;
    }
    
    printf("\nSearch results:\n\n");
    printf("%-40s %-12s %s\n", "PACKAGE", "VERSION", "DESCRIPTION");
    printf("%-40s %-12s %s\n", "-------", "-------", "-----------");
    
    int found = 0;
    cJSON *pkg;
    cJSON_ArrayForEach(pkg, packages) {
        cJSON *id = cJSON_GetObjectItemCaseSensitive(pkg, "id");
        cJSON *name = cJSON_GetObjectItemCaseSensitive(pkg, "name");
        cJSON *version = cJSON_GetObjectItemCaseSensitive(pkg, "version");
        cJSON *description = cJSON_GetObjectItemCaseSensitive(pkg, "description");
        cJSON *keywords = cJSON_GetObjectItemCaseSensitive(pkg, "keywords");
        
        /* Check if query matches id, name, description, or keywords */
        int matches = 0;
        
        if (cJSON_IsString(id)) {
            char temp[MAX_NAME_LEN];
            strncpy(temp, id->valuestring, MAX_NAME_LEN - 1);
            for (size_t i = 0; i < strlen(temp); i++) temp[i] = (char)tolower((unsigned char)temp[i]);
            if (strstr(temp, query_lower)) matches = 1;
        }
        
        if (!matches && cJSON_IsString(name)) {
            char temp[MAX_NAME_LEN];
            strncpy(temp, name->valuestring, MAX_NAME_LEN - 1);
            for (size_t i = 0; i < strlen(temp); i++) temp[i] = (char)tolower((unsigned char)temp[i]);
            if (strstr(temp, query_lower)) matches = 1;
        }
        
        if (!matches && cJSON_IsString(description)) {
            char temp[MAX_DESCRIPTION_LEN];
            strncpy(temp, description->valuestring, MAX_DESCRIPTION_LEN - 1);
            for (size_t i = 0; i < strlen(temp); i++) temp[i] = (char)tolower((unsigned char)temp[i]);
            if (strstr(temp, query_lower)) matches = 1;
        }
        
        if (!matches && cJSON_IsArray(keywords)) {
            cJSON *keyword;
            cJSON_ArrayForEach(keyword, keywords) {
                if (cJSON_IsString(keyword)) {
                    char temp[MAX_NAME_LEN];
                    strncpy(temp, keyword->valuestring, MAX_NAME_LEN - 1);
                    for (size_t i = 0; i < strlen(temp); i++) temp[i] = (char)tolower((unsigned char)temp[i]);
                    if (strstr(temp, query_lower)) {
                        matches = 1;
                        break;
                    }
                }
            }
        }
        
        if (matches) {
            const char *pkg_id = cJSON_IsString(id) ? id->valuestring : "unknown";
            const char *pkg_ver = cJSON_IsString(version) ? version->valuestring : "?";
            const char *pkg_desc = cJSON_IsString(description) ? description->valuestring : "";
            
            /* Truncate description if too long */
            char desc_short[50];
            strncpy(desc_short, pkg_desc, 46);
            desc_short[46] = '\0';
            if (strlen(pkg_desc) > 46) strcat(desc_short, "...");
            
            printf("%-40s %-12s %s\n", pkg_id, pkg_ver, desc_short);
            found++;
        }
    }
    
    if (found == 0) {
        printf("No packages found matching '%s'\n", query);
    } else {
        printf("\nFound %d package(s). Install with: nex install <package>\n", found);
    }
    
    cJSON_Delete(json);
    return 0;
}
