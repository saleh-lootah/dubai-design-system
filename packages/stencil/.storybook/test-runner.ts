import type { TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

// The theme lives on <html data-theme>. A contrast fault often exists in
// one theme only, so every story is checked in both.
const THEMES = ['light', 'dark'];

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    await configureAxe(page, {
      rules: [
        // Storybook renders one component, not a page, so these do not apply.
        { id: 'page-has-heading-one', enabled: false },
        { id: 'landmark-one-main', enabled: false },
        { id: 'region', enabled: false },
      ],
    });

    for (const theme of THEMES) {
      await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);

      await checkA11y(page, '#storybook-root', {
        detailedReport: true,
        detailedReportOptions: { html: false },
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
          },
        },
        verbose: false,
      }, false, 'default', { message: `${context.id} [theme=${theme}]` });
    }
  },
};

export default config;
