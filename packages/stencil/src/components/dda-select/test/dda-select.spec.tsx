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

describe('dda-select main_aria_label', () => {
  it('ignores main_aria_label when a label is set, and keeps aria-labelledby', async () => {
    const page = await render(`<dda-select label="Emirate" main_aria_label="X" selected="Dubai" options='["Dubai","Sharjah"]'></dda-select>`);
    const trigger = page.root.querySelector('.dda-select-header');
    expect(trigger.getAttribute('aria-label')).toBeNull();
    expect(trigger.getAttribute('aria-labelledby')).toBe(`${trigger.id}-label ${trigger.id}`);
  });

  it('uses main_aria_label as aria-label when there is no label', async () => {
    const page = await render(`<dda-select main_aria_label="X" options='["Dubai"]'></dda-select>`);
    const trigger = page.root.querySelector('.dda-select-header');
    expect(trigger.getAttribute('aria-label')).toBe('X');
    expect(trigger.getAttribute('aria-labelledby')).toBeNull();
  });
});

describe('dda-select selectChanged source', () => {
  it('emits the original object, extra fields included, for object options', async () => {
    const list = JSON.stringify([{ id: 1, text: 'Dubai', code: 'DXB' }]);
    const page = await render(`<dda-select options='${list}'></dda-select>`);
    const changed = jest.fn();
    page.root.addEventListener('selectChanged', (e: CustomEvent) => changed(e.detail));
    await open(page);
    options(page)[0].click();
    await page.waitForChanges();
    expect(changed).toHaveBeenCalledWith({ id: 1, text: 'Dubai', code: 'DXB' });
  });

  it('does not leak the source object into selectionChange', async () => {
    const list = JSON.stringify([{ id: 1, text: 'Dubai', code: 'DXB' }]);
    const page = await render(`<dda-select options='${list}'></dda-select>`);
    const selection = jest.fn();
    page.root.addEventListener('selectionChange', (e: CustomEvent) => selection(e.detail));
    await open(page);
    options(page)[0].click();
    await page.waitForChanges();
    expect(selection).toHaveBeenCalledWith({ value: '1', id: 1, text: 'Dubai' });
  });

  it('still emits { id, text } on selectChanged for string options', async () => {
    const page = await render(`<dda-select options='["Dubai"]'></dda-select>`);
    const changed = jest.fn();
    page.root.addEventListener('selectChanged', (e: CustomEvent) => changed(e.detail));
    await open(page);
    options(page)[0].click();
    await page.waitForChanges();
    expect(changed).toHaveBeenCalledWith({ id: 'Dubai', text: 'Dubai' });
  });
});

describe('dda-select selectionChange, matched against the resolved selection', () => {
  it('does not emit re-picking the same option when selected holds text', async () => {
    const list = JSON.stringify([{ id: 1, text: 'Dubai' }]);
    const page = await render(`<dda-select options='${list}' selected="Dubai"></dda-select>`);
    const spy = jest.fn();
    page.root.addEventListener('selectionChange', (e: CustomEvent) => spy(e.detail));
    await open(page);
    options(page)[0].click();
    await page.waitForChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not emit re-picking the same option when selected is set as a number property', async () => {
    const list = JSON.stringify([{ id: 7, text: 'Sharjah' }]);
    const page = await render(`<dda-select options='${list}'></dda-select>`);
    page.root.selected = 7 as unknown as string;
    await page.waitForChanges();
    const spy = jest.fn();
    page.root.addEventListener('selectionChange', (e: CustomEvent) => spy(e.detail));
    await open(page);
    options(page)[0].click();
    await page.waitForChanges();
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('dda-select selectBlurred', () => {
  it('does not fire when focus moves to an option inside the component', async () => {
    const page = await render(`<dda-select options='["Dubai"]'></dda-select>`);
    const spy = jest.fn();
    page.root.addEventListener('selectBlurred', (e: CustomEvent) => spy(e.detail));
    await open(page);
    const option = options(page)[0];
    page.root.querySelector('.dda-select-header').dispatchEvent(new FocusEvent('blur', { relatedTarget: option } as FocusEventInit));
    await page.waitForChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('fires when focus leaves the component entirely', async () => {
    const page = await render(`<dda-select options='["Dubai"]' selected="Dubai"></dda-select>`);
    const spy = jest.fn();
    page.root.addEventListener('selectBlurred', (e: CustomEvent) => spy(e.detail));
    const outside = page.doc.createElement('div');
    const trigger = page.root.querySelector('.dda-select-header');
    trigger.dispatchEvent(new FocusEvent('blur', { relatedTarget: outside } as FocusEventInit));
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith({ name: trigger.id, value: 'Dubai' });
  });

  it('names the event after the generated trigger id when input_name and button_id are unset', async () => {
    const page = await render(`<dda-select options='["Dubai"]' selected="Dubai"></dda-select>`);
    const spy = jest.fn();
    page.root.addEventListener('selectBlurred', (e: CustomEvent) => spy(e.detail));
    const trigger = page.root.querySelector('.dda-select-header');
    trigger.dispatchEvent(new Event('blur'));
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith({ name: trigger.id, value: 'Dubai' });
  });
});

// Bare "show"/"hide" collide with site frameworks: Bootstrap 3 has .hide { display: none !important },
// so a closed select vanished on a consumer page. Our own CSS never used them.
describe('dda-select container classes', () => {
  const container = page => page.root.querySelector('.dda-input-container') as HTMLElement;

  it('adds no generic show/hide class and no "undefined" class when closed', async () => {
    const page = await render(`<dda-select label="Category" options='["A","B"]'></dda-select>`);

    const classes = container(page).className.split(/\s+/).filter(Boolean);
    expect(classes).not.toContain('hide');
    expect(classes).not.toContain('show');
    expect(classes.filter(c => c.includes('undefined'))).toEqual([]);
  });

  it('marks the open state with dda-select-open', async () => {
    const page = await render(`<dda-select label="Category" options='["A","B"]'></dda-select>`);

    await open(page);
    expect(container(page).classList.contains('dda-select-open')).toBe(true);
    expect(container(page).classList.contains('show')).toBe(false);
  });

  it('keeps dda-validation-<type> when a validation type is set', async () => {
    const page = await render(`<dda-select validation_type="error" options='["A"]'></dda-select>`);

    expect(container(page).classList.contains('dda-validation-error')).toBe(true);
  });
});
