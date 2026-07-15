import { Plugin } from 'vue';
import { defineCustomElements } from '@dubai-design-system/components-js/loader';

export const ComponentLibrary: Plugin = {
  async install() {
    defineCustomElements();
  },
};
