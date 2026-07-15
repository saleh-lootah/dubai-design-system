import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'dda',
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
    { type: 'dist-custom-elements', customElementsExportBehavior: 'auto-define-custom-elements', externalRuntime: false },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
