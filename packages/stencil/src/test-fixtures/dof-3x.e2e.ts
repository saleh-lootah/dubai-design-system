import { newE2EPage, E2EPage } from '@stencil/core/testing';
import { readFileSync } from 'fs';
import { join } from 'path';

// Dubai Finance built its site on the 3.x API. This page is its real markup (see the comment in
// dof-3x.html). Every check here is a 3.x behavior that the site depends on.
const fixture = readFileSync(join(__dirname, 'dof-3x.html'), 'utf8');

export async function loadDof(page: E2EPage) {
  await page.setViewport({ width: 1440, height: 900 });
  await page.setContent(fixture);
  await page.waitForChanges();
}

describe('DoF 3.x markup on 5.3.0', () => {
  it('upgrades the header and the sticky footer', async () => {
    const page = await newE2EPage();
    await loadDof(page);
    expect(await page.find('dda-header')).toHaveClass('hydrated');
    expect(await page.find('dda-sticky-footer')).toHaveClass('hydrated');
  });
});
