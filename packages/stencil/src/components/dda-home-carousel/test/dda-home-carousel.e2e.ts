import { newE2EPage } from '@stencil/core/testing';

const cards = JSON.stringify(Array.from({ length: 6 }, (_, i) => ({ banner_card_href: `/c${i}`, image_src: '', banner_card_title: `Card ${i}`, banner_card_description: 'Text' })));
const home = (dir = 'ltr') => `
  <div dir="${dir}">
    <div class="home-intros" style="position: relative; height: 100vh;">
      <div class="dda-home-quick-links-wrap"><div class="dda-home-quick-links">
        <dda-home-carousel items_in_view="4" bannercardlist='${cards}'></dda-home-carousel>
      </div></div>
    </div>
  </div>`;

describe('dda-home-carousel layout', () => {
  it('sits on the banner, 4 cards per view on desktop, and scrolls sideways', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setContent(home());
    await page.waitForChanges();
    const m = await page.evaluate(() => {
      const wrap = document.querySelector('.dda-home-quick-links-wrap');
      const row = document.querySelector('.dda-home-carousel-track');
      const card = document.querySelector('.dda-home-carousel-item').getBoundingClientRect();
      return { position: getComputedStyle(wrap).position, scrolls: row.scrollWidth > row.clientWidth, perView: row.clientWidth / card.width };
    });
    expect(m.position).toBe('absolute');
    expect(m.scrolls).toBe(true);
    expect(Math.round(m.perView)).toBe(4);
  });

  it('uses the compact small-screen card height on a phone', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.setContent(home());
    await page.waitForChanges();
    const height = await page.$eval('.dda-home-carousel-item .link-item', e => Math.round(e.getBoundingClientRect().height));
    expect(height).toBe(112);
  });

  it('mirrors the edge fade in RTL', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1100, height: 800 });
    await page.setContent(home('rtl'));
    await page.waitForChanges();
    const mask = await page.$eval('.dda-home-carousel-track', e => getComputedStyle(e).maskImage || getComputedStyle(e).webkitMaskImage);
    expect(mask).toContain('to left');
  });
});
