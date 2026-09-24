import { parseJsonProp } from '../../utils/parse-json-prop';

// dda-header accepts two shapes for quick-links. 5.x: { label, href, menuLabel, subMenu: [{ title,
// description, icon, href }] }. 3.x (3.5 - 3.12.10): { type, headerMenuLabel, url, active,
// headerMenuId, defaultSubMenuTitle, children }. Both become one model so that render() has one path.

export interface NavLink {
  label: string;
  href: string;
  active: boolean;
  id?: string;
  description?: string;
  icon?: string;
}

export interface NavColumn {
  title?: string;
  links: NavLink[];
}

export interface NavItem extends NavLink {
  kind: 'link' | 'dropdown' | 'mega';
  submenuTitle?: string;
  children: NavItem[];
  columns: NavColumn[];
}

// Raw JSON has no fixed shape until normalized (5.x and 3.x disagree on almost every field name);
// `unknown` values keep this file free of `any` while `clean`/`optional`/`asArray` narrow them.
type RawEntry = Record<string, unknown>;

const clean = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const optional = (value: unknown): string | undefined => clean(value) || undefined;
const isPlainObject = (value: unknown): value is RawEntry => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

// An array field (children, mega-menu columns/items, 5.x subMenu) may contain a bad entry (null, a
// number, ...) even when the field itself is a valid array. Each bad entry is skipped, with one
// warning, rather than reaching a raw.<prop> access on a non-object and throwing.
const asArray = (value: unknown): RawEntry[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(item => {
    if (isPlainObject(item)) return true;
    console.warn('quick-links: an item is not an object; it is ignored.');
    return false;
  });
};

const isLegacy = (raw: RawEntry): boolean => raw.headerMenuLabel !== undefined || raw.type !== undefined;

function legacyItem(raw: RawEntry): NavItem {
  const children = asArray(raw.children);
  const base: NavItem = {
    label: clean(raw.headerMenuLabel),
    href: clean(raw.url) || '#',
    active: raw.active === 'true' || raw.active === true,
    id: optional(raw.headerMenuId),
    description: optional(raw.description),
    icon: optional(raw.quickLinksIcon),
    kind: 'link',
    submenuTitle: optional(raw.defaultSubMenuTitle),
    children: [],
    columns: [],
  };
  if (children.length === 0) return base;
  if (raw.type === 'dda_main_megamenu') {
    return {
      ...base,
      kind: 'mega',
      columns: children.map(col => ({
        title: optional(col.title),
        links: asArray(col.items).map(link => ({
          label: clean(link.headerMenuLabel),
          href: clean(link.url) || '#',
          description: optional(link.description),
          // 3.x always showed an icon in the mega menu, defaulting to 'sentiment_satisfied' when
          // none was set; the 5.x subMenu shape never had a default, so this fallback stays scoped
          // to the 3.x mapping (see modernItem below, which leaves icon undefined).
          icon: optional(link.quickLinksIcon) ?? 'sentiment_satisfied',
          active: false,
        })),
      })),
    };
  }
  return { ...base, kind: 'dropdown', children: children.map(legacyItem) };
}

function modernItem(raw: RawEntry): NavItem {
  const sub = asArray(raw.subMenu);
  const base: NavItem = { label: clean(raw.label), href: clean(raw.href) || '#', active: false, kind: 'link', children: [], columns: [] };
  if (sub.length === 0) return base;
  return {
    ...base,
    kind: 'mega',
    columns: [
      {
        title: optional(raw.menuLabel),
        links: sub.map(link => ({ label: clean(link.title), href: clean(link.href) || '#', description: optional(link.description), icon: optional(link.icon), active: false })),
      },
    ],
  };
}

export function normalizeQuickLinks(value: unknown): NavItem[] {
  return asArray(parseJsonProp<unknown>(value, 'quick-links')).map(raw => (isLegacy(raw) ? legacyItem(raw) : modernItem(raw)));
}
