import { newSpecPage } from '@stencil/core/testing';
import { Ddaselect } from '../dda-select';

const render = (html: string) => newSpecPage({ components: [Ddaselect], html });
const open = async page => {
  (page.root.querySelector('.dda-select-header') as HTMLButtonElement).click();
  await page.waitForChanges();
};
const options = page => Array.from(page.root.querySelectorAll('[role="option"]')) as HTMLButtonElement[];
const trigger = page => page.root.querySelector('.dda-select-header').textContent.trim();

describe('dda-select options', () => {
  it('keeps the 5.3 behaviour for string options', async () => {
    const page = await render(`<dda-select options='["Dubai","Sharjah"]'></dda-select>`);
    const spy = jest.fn();
    page.root.addEventListener('selectionChange', (e: CustomEvent) => spy(e.detail));
    expect(trigger(page)).toContain('Select an option');
    await open(page);
    options(page)[1].click();
    await page.waitForChanges();
    expect(page.root.selected).toBe('Sharjah');
    expect(trigger(page)).toContain('Sharjah');
    expect(spy).toHaveBeenCalledWith({ value: 'Sharjah', id: 'Sharjah', text: 'Sharjah' });
  });

  it('accepts 3.x { id, text } options and emits selectChanged with the option', async () => {
    const list = JSON.stringify([
      { id: 1, text: 'Dubai' },
      { id: 7, text: 'Sharjah' },
    ]);
    const page = await render(`<dda-select options='${list}'></dda-select>`);
    const changed = jest.fn();
    const selection = jest.fn();
    page.root.addEventListener('selectChanged', (e: CustomEvent) => changed(e.detail));
    page.root.addEventListener('selectionChange', (e: CustomEvent) => selection(e.detail));
    await open(page);
    expect(options(page).map(o => o.textContent.trim())).toEqual(['Dubai', 'Sharjah']);
    options(page)[1].click();
    await page.waitForChanges();
    expect(changed).toHaveBeenCalledWith({ id: 7, text: 'Sharjah' });
    expect(selection).toHaveBeenCalledWith({ value: '7', id: 7, text: 'Sharjah' });
    expect(page.root.selected).toBe('7');
    expect(trigger(page)).toContain('Sharjah');
  });

  it('selects by a numeric id given as a string attribute', async () => {
    const list = JSON.stringify([
      { id: 1, text: 'Dubai' },
      { id: 7, text: 'Sharjah' },
    ]);
    const page = await render(`<dda-select options='${list}' selected="7"></dda-select>`);
    expect(trigger(page)).toContain('Sharjah');
    await open(page);
    expect(options(page)[1].getAttribute('aria-selected')).toBe('true');
    expect(options(page)[0].getAttribute('aria-selected')).toBe('false');
  });

  it('also selects by text, as 3.x did', async () => {
    const list = JSON.stringify([
      { id: 1, text: 'Dubai' },
      { id: 7, text: 'Sharjah' },
    ]);
    const page = await render(`<dda-select options='${list}' selected="Dubai"></dda-select>`);
    expect(trigger(page)).toContain('Dubai');
  });

  it('tells apart two options with the same text by id', async () => {
    const list = JSON.stringify([
      { id: 1, text: 'Main office' },
      { id: 2, text: 'Main office' },
    ]);
    const page = await render(`<dda-select options='${list}'></dda-select>`);
    await open(page);
    options(page)[1].click();
    await page.waitForChanges();
    expect(page.root.selected).toBe('2');
    await open(page);
    expect(options(page).map(o => o.getAttribute('aria-selected'))).toEqual(['false', 'true']);
  });

  it('accepts options set as an array property', async () => {
    const page = await render(`<dda-select></dda-select>`);
    page.root.options = [{ id: 'a', text: 'Alpha' }];
    await page.waitForChanges();
    await open(page);
    expect(options(page).map(o => o.textContent.trim())).toEqual(['Alpha']);
  });

  it('shows the placeholder when nothing is selected', async () => {
    const page = await render(`<dda-select options='["Dubai"]' placeholder="اختر"></dda-select>`);
    expect(trigger(page)).toContain('اختر');
  });

  it('emits selectBlurred with the input name and the selected text on blur', async () => {
    const list = JSON.stringify([{ id: 7, text: 'Sharjah' }]);
    const page = await render(`<dda-select options='${list}' selected="7" input_name="emirate"></dda-select>`);
    const spy = jest.fn();
    page.root.addEventListener('selectBlurred', (e: CustomEvent) => spy(e.detail));
    page.root.querySelector('.dda-select-header').dispatchEvent(new Event('blur'));
    expect(spy).toHaveBeenCalledWith({ name: 'emirate', value: 'Sharjah' });
  });

  it('uses main_aria_label and validation_type as 3.x names for aria_label and error', async () => {
    const page = await render(`<dda-select options='["Dubai"]' main_aria_label="الإمارة" validation_type="error"></dda-select>`);
    expect(page.root.querySelector('.dda-select-header').getAttribute('aria-label')).toBe('الإمارة');
    expect(page.root.querySelector('.dda-input-container')).toHaveClass('dda-validation-error');
  });

  it('ignores entries that are not strings or { text } objects', async () => {
    const page = await render(`<dda-select options='["Dubai", null, 5, {"id": 1}]'></dda-select>`);
    await open(page);
    expect(options(page).map(o => o.textContent.trim())).toEqual(['Dubai']);
  });
});
