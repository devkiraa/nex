# Frontend

Static website for browsing Nex packages.

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- Deploys to GitHub Pages

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Structure

```
frontend/
├── src/
│   ├── layouts/
│   │   └── Layout.astro      # Base layout
│   └── pages/
│       ├── index.astro       # Home page
│       ├── docs.astro        # Documentation
│       └── packages/
│           ├── index.astro   # Package listing
│           └── [id].astro    # Package detail
├── public/
│   └── favicon.svg
├── astro.config.mjs
└── package.json
```

## How It Works

1. At build time, Astro fetches `registry/index.json` from GitHub
2. Generates static pages for each package
3. Deployed to GitHub Pages via CI/CD

## Customization

Update `astro.config.mjs` to change:
- `site` - Your GitHub Pages URL
- `base` - Repository name for path prefix
