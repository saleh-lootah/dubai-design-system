// .storybook/manager.js
import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

const theme = create({
  base: 'light', // or 'dark'
  // brandTitle: 'Datacell Design System',
//   brandUrl: 'https://example.com',
  brandImage: 'https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg', 
});

addons.setConfig({
  theme,
});

module.exports = {
  addons: ['@storybook/addon-actions'],
};

