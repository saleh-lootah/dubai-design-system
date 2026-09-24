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
const asArray = (value: unknown): RawEntry[] => (Array.isArray(value) ? (value as RawEntry[]) : []);
const isLegacy = (raw: RawEntry): boolean => Boolean(raw) && (raw.headerMenuLabel !== undefined || raw.type !== undefined);

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
          icon: optional(link.quickLinksIcon),
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
  return parseJsonProp<RawEntry>(value, 'quick-links').map(raw => (isLegacy(raw) ? legacyItem(raw) : modernItem(raw)));
}
