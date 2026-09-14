import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Vite rewrites the entry <script> in the build and drops blocking="render", so add it back.
const renderBlockingEntry = {
  name: 'render-blocking-entry',
  enforce: 'post',
  apply: 'build',
  transformIndexHtml: (html) => html.replace('<script type="module" crossorigin', '<script type="module" blocking="render" crossorigin'),
};

export default defineConfig({
  plugins: [renderBlockingEntry],
  server: {
    host: true,
    allowedHosts: ['.ts.net'],
  },
  build: {
    // setup.js uses top-level await to hold the first paint until components render.
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        gallery: resolve(import.meta.dirname, 'gallery.html'),
        search: resolve(import.meta.dirname, 'search.html'),
      },
    },
  },
});
