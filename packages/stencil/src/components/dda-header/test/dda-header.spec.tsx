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
});
