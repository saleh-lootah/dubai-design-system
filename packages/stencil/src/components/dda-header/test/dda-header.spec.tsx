import { newSpecPage } from '@stencil/core/testing';
import { DdaHeader } from '../dda-header';

// Spec pages load at "/", the path that used to force the transparent style.
const render = (html: string) => newSpecPage({ components: [DdaHeader], html });

describe('dda-header', () => {
  it('does not make itself transparent from the URL', async () => {
    const page = await render(`<dda-header></dda-header>`);

    expect(page.root.querySelector('header')).not.toHaveClass('transparent');
  });

  it('renders colored and white logos so page CSS can pick one', async () => {
    const page = await render(`
      <dda-header
        first-logo-src="first.svg" first-logo-white-src="first-white.svg" first-logo-alt="First"
        second-logo-src="second.svg" second-logo-white-src="second-white.svg" second-logo-alt="Second">
      </dda-header>`);

    const logo = (sel: string) => page.root.querySelector(`.dda-head-logo ${sel}`).getAttribute('src');
    expect(logo('.govt-logo .logo-colored')).toBe('first.svg');
    expect(logo('.govt-logo .logo-white')).toBe('first-white.svg');
    expect(logo('.entt-logo .logo-colored')).toBe('second.svg');
    expect(logo('.entt-logo .logo-white')).toBe('second-white.svg');
  });

  describe('side menu', () => {
    const items = JSON.stringify([
      {
        label: 'Initiatives',
        href: '#',
        subMenu: [
          { label: 'Leaf', href: '/leaf' },
          { label: 'Parent', href: '#', subMenu: [{ label: 'Deep leaf', href: '/deep' }] },
        ],
      },
    ]);
    const click = (a: HTMLAnchorElement) => {
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      a.dispatchEvent(event);
      return event.defaultPrevented;
    };
    const link = (page, label: string) => Array.from(page.root.querySelectorAll('.main_side_menu a') as NodeListOf<HTMLAnchorElement>).find(a => a.textContent.trim() === label);

    it('lets a nested link without a submenu navigate', async () => {
      const page = await render(`<dda-header side-menu-items='${items}'></dda-header>`);

      expect(click(link(page, 'Leaf'))).toBe(false);
      expect(click(link(page, 'Deep leaf'))).toBe(false);
    });

    it('opens a nested submenu instead of navigating', async () => {
      const page = await render(`<dda-header side-menu-items='${items}'></dda-header>`);

      expect(click(link(page, 'Parent'))).toBe(true);
      await page.waitForChanges();
      expect(link(page, 'Deep leaf').closest('.main_sub_menu')).toHaveClass('showSubMenu');
    });
  });

  describe('login link', () => {
    const desktopLogin = page => page.root.querySelector('.dda-toolbar-menu dda-link-button');
    const sideLogin = page => page.root.querySelector('.dda-toolbar-menu-sidemenu dda-link-button');

    it('uses login-text and login-icon in the desktop toolbar', async () => {
      const page = await render(`<dda-header login-text="Sign in" login-icon="person"></dda-header>`);

      expect(desktopLogin(page).textContent.trim()).toBe('Sign in');
      expect(desktopLogin(page).getAttribute('start_icon')).toBe('person');
      expect(desktopLogin(page).closest('dda-tooltip').getAttribute('title_text')).toBe('Sign in');
    });

    it('keeps the Login default when login-text is not set', async () => {
      const page = await render(`<dda-header></dda-header>`);

      expect(desktopLogin(page).textContent.trim()).toBe('Login');
      expect(sideLogin(page).textContent.trim()).toBe('Login');
    });

    it('hides the login link in the toolbar and the side menu with hide_login', async () => {
      const page = await render(`<dda-header hide_login></dda-header>`);

      expect(desktopLogin(page)).toBeNull();
      expect(sideLogin(page)).toBeNull();
    });
  });

  describe('accessibility panel texts', () => {
    const panelTexts = (page, variant: 'desktop' | 'mobile') => {
      const panel = page.root.querySelector(variant === 'desktop' ? '.dda-accessibility-wrap .dda-accessibility' : '.mobile-accessibility');
      return {
        headings: Array.from(panel.querySelectorAll('h2')).map((h: HTMLElement) => h.textContent.trim()),
        legend: panel.querySelector('legend')?.textContent.trim(),
        radios: Array.from(panel.querySelectorAll('dda-radiobutton')).map((r: HTMLElement) => r.getAttribute('title_text')),
      };
    };

    it('keeps the 5.2 English texts when no text prop is set', async () => {
      const page = await render(`<dda-header read-speaker-link="#rs"></dda-header>`);
      for (const variant of ['desktop', 'mobile'] as const) {
        const t = panelTexts(page, variant);
        expect(t.headings).toEqual(['Contrast', 'Screen Reader', 'Text Size']);
        expect(t.legend).toBe('Select your preferred contrast setting');
        expect(t.radios).toEqual(['Normal', 'Colours Blind', 'Red Weakness', 'Green Weakness']);
      }
    });

    it('uses the 3.x text attributes in both panels', async () => {
      const page = await render(`<dda-header
        contrast_title="تباين الألوان" contrast_description="حدد الإعداد"
        contrast_noraml_text="عادي" contrast_color_blind_text="عمى الألوان"
        contrast_red_weakness_text="أحمر" contrast_green_weakness_text="أخضر"
        screen_reader_title="قارئ الشاشة" screen_reader_description="استمع"
        text_size_title="حجم النص" text_size_description="استخدم الأزرار"
        read_speaker_link="#rs"></dda-header>`);
      for (const variant of ['desktop', 'mobile'] as const) {
        const t = panelTexts(page, variant);
        expect(t.headings).toEqual(['تباين الألوان', 'قارئ الشاشة', 'حجم النص']);
        expect(t.legend).toBe('حدد الإعداد');
        expect(t.radios).toEqual(['عادي', 'عمى الألوان', 'أحمر', 'أخضر']);
      }
    });

    it('prefers contrast_normal_text over the 3.x spelling', async () => {
      const page = await render(`<dda-header contrast_normal_text="New" contrast_noraml_text="Old"></dda-header>`);
      expect(panelTexts(page, 'desktop').radios[0]).toBe('New');
    });

    it('removes a text element whose attribute is empty', async () => {
      const page = await render(`<dda-header contrast_title="" contrast_description=""></dda-header>`);
      const t = panelTexts(page, 'desktop');
      expect(t.headings).toEqual(['Text Size']);
      expect(t.legend).toBeUndefined();
    });

    it('shows the screen reader column for the 3.x read_speaker_link attribute', async () => {
      const page = await render(`<dda-header read_speaker_link="https://rs.example/play"></dda-header>`);
      const links = Array.from(page.root.querySelectorAll('a.readspeaker')) as HTMLAnchorElement[];
      expect(links).toHaveLength(2);
      expect(links[0].getAttribute('href')).toBe('https://rs.example/play');
      expect(links[0].getAttribute('aria-label')).toBe('Listen to this page using ReadSpeaker');
    });

    it('marks the selected contrast and text size', async () => {
      const page = await render(`<dda-header selected_contrast="redweakness" selected_text_size="large"></dda-header>`);
      // dda-radiobutton is not registered in this spec page, so Stencil writes `checked` as an attribute.
      const radios = Array.from(page.root.querySelectorAll('.dda-accessibility-wrap dda-radiobutton')) as HTMLElement[];
      expect(radios.map(r => r.hasAttribute('checked'))).toEqual([false, false, true, false]);
      const sizes = Array.from(page.root.querySelectorAll('.dda-accessibility-wrap .dda-text-size-buttons dda-button')) as HTMLElement[];
      expect(sizes.map(b => b.getAttribute('button_color'))).toEqual(['default-secondary', 'default-primary', 'default-secondary']);
    });

    it('updates the selected contrast when the user picks one', async () => {
      const page = await render(`<dda-header></dda-header>`);
      const blind = page.root.querySelectorAll('.dda-accessibility-wrap dda-radiobutton')[1] as HTMLElement;
      blind.click();
      await page.waitForChanges();
      expect(page.root.selected_contrast).toBe('colorblind');
    });
  });
});
