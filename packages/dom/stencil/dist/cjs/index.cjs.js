'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function format(first, middle, last) {
    return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

function applyTheme(theme) {
    const root = document.documentElement;
  
    // Apply colors
    for (const [key, value] of Object.entries(theme.colors)) {
      root.style.setProperty(`--${key}`, value);
    }
  
    // Apply font families
    if (theme.fontFamily) {
      root.style.setProperty('--font-family-main', theme.fontFamily.main.join(', '));
    }
  }

exports.applyTheme = applyTheme;
exports.format = format;

//# sourceMappingURL=index.cjs.js.map