import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://try-nex.vercel.app',
  // base: '/nex',
  integrations: [sitemap()],
  output: 'hybrid', // Hybrid mode: static by default, SSR for dynamic routes
  adapter: vercel(), // Vercel adapter for SSR support
});
