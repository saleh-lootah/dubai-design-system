import { defineCustomElements } from '../loader';
import "../src/global/global.css";
import 'quill/dist/quill.snow.css';
import 'material-icons/iconfont/material-icons.css';
import 'material-symbols';

// Define custom elements
defineCustomElements();

// Set theme attribute
const setThemeAttribute = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

setThemeAttribute('light'); // Set the initial theme to 'light'
window.setThemeAttribute = setThemeAttribute;

// Dynamically add Material Icons stylesheet
// const addMaterialIcons = () => {
//   const styles = [
//     'https://fonts.googleapis.com/icon?family=Material+Icons',
//     'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap',
//     'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded&display=swap',
//   ];

//   styles.forEach((href) => {
//     const link = document.createElement('link');
//     link.href = href;
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);
//   });
// };

// // Call the function to add the icons
// addMaterialIcons();


// // Ensure Material Icons are loaded
// addMaterialIcons();

const preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          "Getting Started",
          "Foundations",
          "Components",
          "*",
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    html: {
      removeComments: /^\s*remove me\s*$/,
      removeEmptyComments: true,
      prettier: {
        tabWidth: 4,
        useTabs: false,
        htmlWhitespaceSensitivity: "strict",
      },
    },
  },
};

export default preview;