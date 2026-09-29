import { newSpecPage } from '@stencil/core/testing';
import { DdaAvatar } from '../dda-avatar';

const render = (attrs: string) => newSpecPage({ components: [DdaAvatar], html: `<dda-avatar ${attrs}></dda-avatar>` });

describe('dda-avatar icons', () => {
  it('hides the smiley icon from assistive technology', async () => {
    const page = await render('type="icon"');

    expect(page.root.querySelector('i.dda-smile').getAttribute('aria-hidden')).toBe('true');
  });

  it('hides the verified icon and gives the badge a text label', async () => {
    const page = await render('design="verified"');

    const badge = page.root.querySelector('.verified-icon');
    expect(badge.querySelector('.material-icons').getAttribute('aria-hidden')).toBe('true');
    expect(badge.querySelector('.visually-hidden').textContent).toBe('Verified');
  });

  it('uses verified_label as the badge text', async () => {
    const page = await render('design="verified" verified_label="موثق"');

    expect(page.root.querySelector('.verified-icon .visually-hidden').textContent).toBe('موثق');
  });
});
