import { newE2EPage } from '@stencil/core/testing';

// global.css removes the underline from every link. Links inside running text must keep one,
// so they are not told apart by color alone (WCAG 1.4.1).
describe('global link styles', () => {
  const decoration = (page, selector: string) => page.evaluate(sel => getComputedStyle(document.querySelector(sel)).textDecorationLine, selector);

  it('underlines plain links in running text', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <p>Read the <a id="in-text" href="#">service terms</a> first.</p>
      <table><tr><td><a id="in-cell" href="#">Download</a></td></tr></table>
    `);

    expect(await decoration(page, '#in-text')).toBe('underline');
    expect(await decoration(page, '#in-cell')).toBe('underline');
  });

  it('keeps links that are styled as components or navigation without an underline', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <p><a id="classed" class="dda-btn" href="#">Apply</a></p>
      <ul><li><a id="menu" href="#">Services</a></li></ul>
    `);

    expect(await decoration(page, '#classed')).toBe('none');
    expect(await decoration(page, '#menu')).toBe('none');
  });
});
