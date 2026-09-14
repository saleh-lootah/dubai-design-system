import { resolve } from 'node:path';
import { defineConfig } from 'vite';

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
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        gallery: resolve(import.meta.dirname, 'gallery.html'),
        search: resolve(import.meta.dirname, 'search.html'),
        services: resolve(import.meta.dirname, 'services.html'),
        service: resolve(import.meta.dirname, 'service.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
      },
    },
  },
});
