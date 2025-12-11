/*
 * Run command - Execute a package's command
 */

#include "nex.h"

int cmd_run(int argc, char *argv[]) {
    if (argc < 1) {
        print_error("Usage: nex run <package-id> [command] [args...]");
        printf("Example: nex run author.package-name\n");
        printf("         nex run author.package-name convert --input file.txt\n");
        return 1;
    }
    
    const char *package_id = argv[0];
    const char *command = "default";
    int cmd_argc = 0;
    char **cmd_argv = NULL;
    
    /* Check for command name */
    if (argc > 1) {
        /* Check if it's a command name or an argument (starts with -) */
        if (argv[1][0] != '-') {
            command = argv[1];
            cmd_argc = argc - 2;
            cmd_argv = argv + 2;
        } else {
            cmd_argc = argc - 1;
            cmd_argv = argv + 1;
        }
    }
    
    LocalPackage local;
    
    /* Check if installed */
    if (!package_is_installed(package_id, &local)) {
        print_info("Package '%s' is not installed. Installing now...", package_id);
        
        if (package_install(package_id) != 0) {
            print_error("Failed to install package: %s", package_id);
            return 1;
        }
        
        print_success("Package installed successfully");
    }
    
    /* Execute the package */
    return package_execute(package_id, command, cmd_argc, cmd_argv);
}
