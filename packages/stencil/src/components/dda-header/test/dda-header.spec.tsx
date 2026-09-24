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

  describe('toolbar texts and 3.x toolbar behavior', () => {
    const tooltip = (page, sel: string) => page.root.querySelector(sel).closest('dda-tooltip').getAttribute('title_text');

    it('keeps the 5.2 toolbar texts when no prop is set', async () => {
      const page = await render(`<dda-header></dda-header>`);
      expect(tooltip(page, '.dda-toolbar-menu .accessibility-btn')).toBe('Accessibility');
      expect(page.root.querySelector('.dda-toolbar-menu .accessibility-btn .visually-hidden').textContent).toBe('Accessibility');
      expect(page.root.querySelector('.dda-toolbar-menu .accessibility-btn i').textContent.trim()).toBe('accessibility');
      expect(tooltip(page, '.dda-toolbar-menu form.dda-search')).toBe('Search');
      expect(page.root.querySelector('.dda-toolbar-menu input').getAttribute('placeholder')).toBe('Search');
      expect(tooltip(page, '.dda-toolbar-menu dda-button[lang]')).toBe('Language');
      expect(tooltip(page, '.dda-toolbar-menu dda-link-button')).toBe('Login');
      expect(tooltip(page, '.hamburger-menu-btn')).toBe('Menu');
    });

    it('uses the 3.x toolbar attributes', async () => {
      const page = await render(`<dda-header
        accessibility_tooltip="إمكانية الوصول" accessibility_button_text="إمكانية الوصول إلى الموقع"
        accessibility_button_id="a11y" accessibility_button_icon_family="material-icons"
        accessibility_button_icon_name="accessible_forward"
        search_tooltip="بحث" search_input_placeholder="يبحث" language_tooltip="تغيير اللغة"
        login-text="دخول" login_tooltip="تسجيل الدخول" menu_button_label="القائمة"></dda-header>`);
      const desktop = page.root.querySelector('.dda-toolbar-menu .accessibility-btn');
      expect(tooltip(page, '.dda-toolbar-menu .accessibility-btn')).toBe('إمكانية الوصول');
      expect(desktop.getAttribute('id')).toBe('a11y');
      expect(desktop.querySelector('.visually-hidden').textContent).toBe('إمكانية الوصول إلى الموقع');
      expect(desktop.querySelector('i').getAttribute('class')).toBe('material-icons');
      expect(desktop.querySelector('i').textContent.trim()).toBe('accessible_forward');
      expect(page.root.querySelector('.dda-toolbar-menu-sidemenu .accessibility-btn').getAttribute('id')).toBe('a11y-sidemenu');
      expect(tooltip(page, '.dda-toolbar-menu form.dda-search')).toBe('بحث');
      expect(page.root.querySelector('.dda-toolbar-menu input').getAttribute('placeholder')).toBe('يبحث');
      expect(tooltip(page, '.dda-toolbar-menu dda-button[lang]')).toBe('تغيير اللغة');
      expect(tooltip(page, '.dda-toolbar-menu dda-link-button')).toBe('تسجيل الدخول');
      expect(tooltip(page, '.hamburger-menu-btn')).toBe('القائمة');
    });

    it('falls back to the default when a tooltip attribute is empty', async () => {
      const page = await render(`<dda-header search_tooltip=""></dda-header>`);
      expect(tooltip(page, '.dda-toolbar-menu form.dda-search')).toBe('Search');
    });

    it('falls back to the default hamburger tooltip when menu_button_label is empty', async () => {
      const page = await render(`<dda-header menu_button_label=""></dda-header>`);
      expect(tooltip(page, '.hamburger-menu-btn')).toBe('Menu');
    });

    it('removes Login and the language button when their text is empty, as 3.x did', async () => {
      const page = await render(`<dda-header login-text="" language_text=""></dda-header>`);
      expect(page.root.querySelector('dda-link-button')).toBeNull();
      expect(page.root.querySelector('.dda-toolbar-menu dda-button[lang]')).toBeNull();
      expect(page.root.querySelector('.dda-toolbar-menu-sidemenu button[lang]')).toBeNull();
    });

    it('does not render the panels when use-predesigned-accessibility-menu is false', async () => {
      const page = await render(`<dda-header use-predesigned-accessibility-menu="false"></dda-header>`);
      expect(page.root.querySelector('.dda-accessibility')).toBeNull();
      expect(page.root.querySelectorAll('.accessibility-btn')).toHaveLength(2);
    });

    it('emits accessibilitymenufunctionality on each accessibility button click', async () => {
      const page = await render(`<dda-header></dda-header>`);
      const spy = jest.fn();
      page.root.addEventListener('accessibilitymenufunctionality', spy);
      (page.root.querySelector('.dda-toolbar-menu .accessibility-btn') as HTMLElement).click();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    // DoF's handler is `gotoSearchPage(event.detail)`: it opens the results page on every
    // searchfunctionality event. So the event fires on submit only, never while the user types.
    it('emits searchfunctionality with the query on submit, not while the user types', async () => {
      const page = await render(`<dda-header></dda-header>`);
      const spy = jest.fn();
      page.root.addEventListener('searchfunctionality', (e: CustomEvent) => spy(e.detail));
      const form = page.root.querySelector('.dda-toolbar-menu form') as HTMLFormElement;
      const input = form.querySelector('input') as HTMLInputElement;
      input.value = 'budget';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(spy).not.toHaveBeenCalled();
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      expect(spy).toHaveBeenCalledWith('budget');
    });

    it('does not emit searchfunctionality for an empty query', async () => {
      const page = await render(`<dda-header></dda-header>`);
      const spy = jest.fn();
      page.root.addEventListener('searchfunctionality', spy);
      const form = page.root.querySelector('.dda-toolbar-menu form') as HTMLFormElement;
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('side menu titles, other menu and 3.x mobile search', () => {
    it('keeps the 5.2 side-menu title and has no other menu by default', async () => {
      const page = await render(`<dda-header></dda-header>`);
      expect(page.root.querySelector('.dda-side-nav-title').textContent).toBe('Quick Links');
      expect(page.root.querySelectorAll('ul.main_side_menu')).toHaveLength(1);
      expect(page.root.querySelector('.dda-mobile-search button')).not.toBeNull();
    });

    it('renders the main title, the other title and the other menu', async () => {
      const items = JSON.stringify([
        { label: 'Careers', href: '/careers', active: 'true' },
        { label: 'FAQ', href: '/faq' },
      ]);
      const page = await render(`<dda-header side-main-menu-title="قائمة الموقع" side-other-menu-title="روابط أخرى" other-menu-items='${items}'></dda-header>`);
      const titles = Array.from(page.root.querySelectorAll('.dda-side-nav-title')).map((t: HTMLElement) => t.textContent);
      expect(titles).toEqual(['قائمة الموقع', 'روابط أخرى']);
      const other = page.root.querySelectorAll('ul.main_side_menu')[1];
      const links = Array.from(other.querySelectorAll('a')) as HTMLAnchorElement[];
      expect(links.map(a => a.textContent)).toEqual(['Careers', 'FAQ']);
      expect(links[0]).toHaveClass('active');
      expect(links[0].getAttribute('aria-current')).toBe('page');
    });

    it('accepts other menu items set as an array property', async () => {
      const page = await render(`<dda-header></dda-header>`);
      page.root.otherMenuItems = [{ label: 'FAQ', href: '/faq' }];
      await page.waitForChanges();
      expect(page.root.querySelectorAll('ul.main_side_menu')[1].querySelector('a').textContent).toBe('FAQ');
    });

    it('hides the other menu with hide-other-menu', async () => {
      const items = JSON.stringify([{ label: 'FAQ', href: '/faq' }]);
      const page = await render(`<dda-header side-other-menu-title="Other" other-menu-items='${items}' hide-other-menu="true"></dda-header>`);
      expect(page.root.querySelectorAll('ul.main_side_menu')).toHaveLength(1);
      expect(page.root.querySelectorAll('.dda-side-nav-title')).toHaveLength(1);
    });

    it('ignores invalid other-menu JSON', async () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const page = await render(`<dda-header other-menu-items='[{'></dda-header>`);
      expect(page.root.querySelectorAll('ul.main_side_menu')).toHaveLength(1);
      expect(warn).toHaveBeenCalledTimes(1);
      warn.mockRestore();
    });

    it('renders the 3.x mobile search link when mobile-menu-search-url is set', async () => {
      const page = await render(`<dda-header mobile-menu-search-id="mobileSearch" mobile-menu-search-url="/search"></dda-header>`);
      const link = page.root.querySelector('.dda-mobile-search a') as HTMLAnchorElement;
      expect(link.getAttribute('id')).toBe('mobileSearch');
      expect(link.getAttribute('href')).toBe('/search');
      expect(link.querySelector('.visually-hidden').textContent).toBe('Search');
      expect(page.root.querySelector('.dda-mobile-search button')).toBeNull();
      expect(page.root.querySelector('.dda-mobile-search-panel')).toBeNull();
    });
  });
});
