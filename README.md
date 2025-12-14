# Nex

> **N**imble **Ex**ecutor - The package manager for the AI era.

Nex is a next-generation package manager built for developer tools. It allows you to discover, install, and run tools from a decentralized, GitHub-backed registry. It natively supports Python, Node.js, Bash, and Binary runtimes.

![Nex Banner](https://raw.githubusercontent.com/devkiraa/nex/main/docs/assets/banner.png)

## 🚀 Features

- **Decentralized Registry**: Packages are just JSON files on GitHub. No central server.
- **Universal Runtime**: Run Python, Node.js, and Shell scripts with a single command.
- **AI-Native**: Built-in support for AI-generated tools and workflows.
- **Zero Config**: Automatically handles dependency installation (pip/npm).
- **Blazing Fast**: Written in optimized C for instant startup.

## 📦 Quick Start

### Installation

**Windows (PowerShell)**
```powershell
iwr https://nex.sh/install.ps1 | iex
```

**Linux / macOS**
```bash
curl -fsSL https://nex.sh/install.sh | bash
```

### Basic Usage

```bash
# search for tools
nex search "website downloader"

# Install a tool
nex install devkiraa.pagepull

# Run it
nex run pagepull --url google.com

# Or create a shortcut
nex alias pp pagepull
nex run pp --url google.com
```

## 🤖 For AI Agents & LLMs

Building a tool with AI? Copy this prompt to Claude, ChatGPT, or Gemini to have it build a fully compatible Nex package for you.

<details>
<summary>Click to copy the <b>Nex System Prompt</b></summary>

```markdown
# Nex Package Creation System Prompt

You are an expert developer task to create a package for the Nex package manager.
Nex is a universal CLI tool runner that supports Python, Node.js, and Bash.

## Package Structure
A Nex package resides in a GitHub repository and must contain:
1. `manifest.json`: Metadata and execution instructions.
2. Source Code: The actual script implementation.
3. Dependencies: `requirements.txt` (Python) or `package.json` (Node).

## Manifest Schema (manifest.json)
```json
{
  "$schema": "https://raw.githubusercontent.com/devkiraa/nex/main/registry/schema/package.schema.json",
  "id": "username.package-name",
  "name": "package-name",
  "version": "1.0.0",
  "description": "Short description of what the tool does.",
  "author": { "name": "username", "github": "username" },
  "license": "MIT",
  "repository": "https://github.com/username/package-name",
  "runtime": { "type": "python" },  // or "node", "bash"
  "entrypoint": "main.py",          // or "index.js", "script.sh"
  "commands": {
    "default": "python main.py",    // Command to run the tool
    "install": "pip install -r requirements.txt" // Dependency installation
  }
}
```

## Your Task
1. Write the code for the tool (e.g., `main.py`).
2. Generate the `manifest.json` following the schema above.
3. Generate the dependency file (`requirements.txt` or `package.json`).
4. Provide instructions to initialize and publish using `nex init` and `nex publish`.

Now, please build a tool that [INSERT YOUR TOOL IDEA HERE].
```

</details>

## 🛠️ Commands

| Command | Description |
|---------|-------------|
| `nex install <pkg>` | Install a package from the registry |
| `nex run <pkg>` | Run an installed package |
| `nex list` | List installed packages |
| `nex search <query>` | Search the registry |
| `nex remove <pkg>` | Uninstall a package |
| `nex update` | Update all packages |
| `nex init` | **(Dev)** Wizard to create a new package |
| `nex publish` | **(Dev)** Instructions to publish a package |
| `nex alias` | Create shortcuts (e.g., `pp` -> `pagepull`) |
| `nex config` | Manage CLI settings |

## 🏗️ Project Structure

```
nex/
├── cli/           # The C-based CLI executable
├── registry/      # Database of available packages (JSON)
├── frontend/      # The web catalog (Astro site)
└── docs/          # Documentation & Guides
```

## 🤝 Contributing

We love contributions!
1. Check [CONTRIBUTING.md](CONTRIBUTING.md) for dev setup.
2. Join our Discord (link coming soon).

## 📄 License

MIT License © 2024 DevKiraa
