import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const PAGES = ['index', 'gallery', 'search', 'services', 'service', 'about', 'contact'];

export default defineConfig({
  // The URL path the site is served from. GitHub Pages sets SAMPLE_BASE (for example
  // /dubai-design-system/sample/); site links are relative, so they follow it.
  base: process.env.SAMPLE_BASE || '/',
  server: {
    host: true,
    allowedHosts: ['.ts.net'],
  },
  // `npm run serve`: the built site, which loads far faster over a network than the dev server.
  preview: {
    host: true,
    allowedHosts: ['.ts.net'],
  },
  build: {
    rollupOptions: {
      // Every page in English, and in Arabic under ar/.
      input: Object.fromEntries(
        PAGES.flatMap((page) => [
          [page, resolve(import.meta.dirname, `${page}.html`)],
          [`ar-${page}`, resolve(import.meta.dirname, 'ar', `${page}.html`)],
        ]),
      ),
    },
  },
});
