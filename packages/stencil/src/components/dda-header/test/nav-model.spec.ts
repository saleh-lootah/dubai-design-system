import { normalizeQuickLinks } from '../nav-model';

describe('normalizeQuickLinks', () => {
  it('reads the 5.x shape as mega menus', () => {
    const [home, services] = normalizeQuickLinks([
      { label: 'Home', href: '/' },
      { label: 'Services', href: '#', menuLabel: 'All services', subMenu: [{ title: 'Pay fines', description: 'Online', icon: 'payments', href: '/fines' }] },
    ]);
    expect(home).toMatchObject({ kind: 'link', label: 'Home', href: '/' });
    expect(services.kind).toBe('mega');
    expect(services.columns).toEqual([{ title: 'All services', links: [{ label: 'Pay fines', href: '/fines', description: 'Online', icon: 'payments', active: false }] }]);
  });

  it('reads the 3.x default submenu shape as dropdowns, three levels deep', () => {
    const [about] = normalizeQuickLinks(
      JSON.stringify([
        {
          type: 'dda_default_submenu',
          headerMenuLabel: ' About ',
          url: '#',
          children: [
            { type: 'dda_default_submenu', headerMenuLabel: 'Strategy', url: '/strategy', children: [] },
            {
              type: 'dda_default_submenu',
              headerMenuLabel: 'Policies',
              url: '#',
              defaultSubMenuTitle: 'All policies',
              children: [{ headerMenuLabel: 'Quality', url: '/quality', children: [] }],
            },
          ],
        },
      ]),
    );
    expect(about).toMatchObject({ kind: 'dropdown', label: 'About', href: '#' });
    expect(about.children.map(c => [c.kind, c.label])).toEqual([
      ['link', 'Strategy'],
      ['dropdown', 'Policies'],
    ]);
    expect(about.children[1].submenuTitle).toBe('All policies');
    expect(about.children[1].children[0]).toMatchObject({ label: 'Quality', href: '/quality' });
  });

  it('reads the 3.x mega menu shape as columns', () => {
    const [item] = normalizeQuickLinks([
      {
        type: 'dda_main_megamenu',
        headerMenuLabel: 'Services',
        url: '#',
        children: [{ title: 'Pay', items: [{ headerMenuLabel: 'Fines', url: '/fines', description: 'Online', quickLinksIcon: 'payments' }] }],
      },
    ]);
    expect(item.kind).toBe('mega');
    expect(item.columns).toEqual([{ title: 'Pay', links: [{ label: 'Fines', href: '/fines', description: 'Online', icon: 'payments', active: false }] }]);
  });

  it('marks active items from the 3.x "active": "true" field', () => {
    const [item] = normalizeQuickLinks([{ type: 'dda_default_submenu', headerMenuLabel: 'Home', url: '/', active: 'true', children: [] }]);
    expect(item.active).toBe(true);
  });

  it('returns [] for invalid input', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(normalizeQuickLinks('not json')).toEqual([]);
    expect(normalizeQuickLinks(undefined)).toEqual([]);
    warn.mockRestore();
  });
});
