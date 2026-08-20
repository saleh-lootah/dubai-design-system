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

    // checkA11y is called with skipFailures = false, so it throws as soon as it
    // finds a violation. Left unguarded, that throw would escape this loop and
    // skip every theme after the first failing one. Catch each theme's failure
    // separately so all of them get checked, record which theme(s) failed, then
    // report everything in a single error so the theme is visible in the output.
    const failures: { theme: string; message: string }[] = [];

    for (const theme of THEMES) {
      await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);

      try {
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
        }, false);
      } catch (error) {
        failures.push({ theme, message: error instanceof Error ? error.message : String(error) });
      }
    }

    // Leave the page in a known state for whatever postVisit checks run next
    // (Task 4 appends more to this same hook) instead of stuck on the last theme.
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

    if (failures.length > 0) {
      const summary = failures
        .map(({ theme, message }) => `  [theme=${theme}] ${message}`)
        .join('\n');
      throw new Error(`${context.id} failed accessibility checks:\n${summary}`);
    }
  },
};

export default config;
