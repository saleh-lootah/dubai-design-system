import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'dda',
  globalStyle: 'src/global/dda-bundle.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    reactOutputTarget({
      // componentCorePackage: '@dubai-design-system/components-js',
      // proxiesFile: '../react/lib/components/stencil-generated/index.ts',
      // includeImportCustomElements: true
      outDir: '../react/lib/components/stencil-generated/',
    }),
    angularOutputTarget({
      componentCorePackage: '@dubai-design-system/components-js',
      outputType: 'component',
      directivesProxyFile: '../angular/projects/stencil-wrapper/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../angular/projects/stencil-wrapper/src/lib/stencil-generated/index.ts',
    }),
    vueOutputTarget({
      componentCorePackage: '@dubai-design-system/components-js',
      proxiesFile: '../vue/lib/components.ts',
      // includeImportCustomElements: true,
      // includePolyfills: true,
    }),
    {
      type: 'docs-readme'
    },
    {
      type: 'docs-json',
      file: './stencil-docs.json',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
      // The Dubai font binaries must land at `dist/assets/fonts/dubai/` so the
      // `url("../assets/fonts/dubai/…")` references in `dist/dda/dda.css` resolve.
      // This copy task hangs off `dist-custom-elements` rather than the `dist` target
      // because `dist.copy` is hard-wired to write into `dist/collection` and cannot
      // reach the `dist/` root; `dist-custom-elements.copy` resolves `dest` against the
      // package root, which is the only lever that can. `src` resolves against `srcDir`.
      // Only woff2/woff/ttf are shipped — eot and svg are dropped (see the 404 fix plan).
      copy: [
        { src: 'assets/fonts/dubai/*.woff2', dest: 'dist/assets/fonts/dubai', warn: true },
        { src: 'assets/fonts/dubai/*.woff', dest: 'dist/assets/fonts/dubai', warn: true },
        { src: 'assets/fonts/dubai/*.ttf', dest: 'dist/assets/fonts/dubai', warn: true },
      ],
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
