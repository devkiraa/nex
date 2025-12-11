/*
 * HTTP Client - Using libcurl for HTTP requests
 */

#include "nex.h"
#include <curl/curl.h>

static CURL *curl_handle = NULL;

/* Memory write callback for curl */
static size_t write_callback(void *contents, size_t size, size_t nmemb, void *userp) {
    size_t realsize = size * nmemb;
    HttpResponse *response = (HttpResponse *)userp;
    
    char *ptr = realloc(response->data, response->size + realsize + 1);
    if (!ptr) {
        print_error("Out of memory");
        return 0;
    }
    
    response->data = ptr;
    memcpy(&(response->data[response->size]), contents, realsize);
    response->size += realsize;
    response->data[response->size] = '\0';
    
    return realsize;
}

int http_init(void) {
    if (curl_global_init(CURL_GLOBAL_DEFAULT) != CURLE_OK) {
        return -1;
    }
    
    curl_handle = curl_easy_init();
    if (!curl_handle) {
        curl_global_cleanup();
        return -1;
    }
    
    return 0;
}

void http_cleanup(void) {
    if (curl_handle) {
        curl_easy_cleanup(curl_handle);
        curl_handle = NULL;
    }
    curl_global_cleanup();
}

HttpResponse* http_get(const char *url) {
    if (!curl_handle || !url) {
        return NULL;
    }
    
    HttpResponse *response = calloc(1, sizeof(HttpResponse));
    if (!response) {
        return NULL;
    }
    
    response->data = malloc(1);
    response->size = 0;
    response->data[0] = '\0';
    
    curl_easy_reset(curl_handle);
    curl_easy_setopt(curl_handle, CURLOPT_URL, url);
    curl_easy_setopt(curl_handle, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl_handle, CURLOPT_WRITEDATA, response);
    curl_easy_setopt(curl_handle, CURLOPT_USERAGENT, NEX_USER_AGENT);
    curl_easy_setopt(curl_handle, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(curl_handle, CURLOPT_TIMEOUT, 30L);
    curl_easy_setopt(curl_handle, CURLOPT_SSL_VERIFYPEER, 1L);
    
    CURLcode res = curl_easy_perform(curl_handle);
    
    if (res != CURLE_OK) {
        print_error("HTTP request failed: %s", curl_easy_strerror(res));
        http_response_free(response);
        return NULL;
    }
    
    curl_easy_getinfo(curl_handle, CURLINFO_RESPONSE_CODE, &response->status_code);
    
    return response;
}

void http_response_free(HttpResponse *response) {
    if (response) {
        if (response->data) {
            free(response->data);
        }
        free(response);
    }
}
