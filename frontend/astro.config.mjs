import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://try-nex.vercel.app',
  integrations: [sitemap()],
  output: 'hybrid',
  adapter: vercel(),
});
