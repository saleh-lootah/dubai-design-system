// Languages. Each page exists once per language: English at /<page>.html, Arabic at
// /ar/<page>.html, with the language and direction in <html lang dir>. Scripts are shared and
// read the page's language from <html lang>. Text that scripts write comes from the message
// tables each script passes to createT(); numbers, fees and plurals use Intl with the locale tag.

export const LOCALES = {
  en: { tag: 'en-AE', dir: 'ltr', name: 'English' },
  ar: { tag: 'ar-AE', dir: 'rtl', name: 'العربية' },
};

export const locale = document.documentElement.lang.toLowerCase().startsWith('ar') ? 'ar' : 'en';
export const otherLocale = locale === 'ar' ? 'en' : 'ar';
const tag = LOCALES[locale].tag;

const pluralRules = new Intl.PluralRules(tag);
const numberFormat = new Intl.NumberFormat(tag);

/**
 * Returns t(key, params) for one script's messages: { en: { key: text }, ar: { key: text } }.
 * `{name}` in a text is replaced by params.name. A text can be an object of plural forms
 * (Arabic has zero, one, two, few, many and other), chosen by params.count with Intl.PluralRules.
 * A key missing in Arabic falls back to English, and a key missing in both shows the key.
 */
export function createT(messages) {
  return (key, params = {}) => {
    let text = messages[locale]?.[key] ?? messages.en?.[key] ?? key;
    if (typeof text === 'object') {
      text = text[pluralRules.select(params.count)] ?? text.other;
    }
    return text.replace(/\{(\w+)\}/g, (match, name) => {
      const value = params[name];
      if (value === undefined) return match;
      return typeof value === 'number' ? numberFormat.format(value) : String(value);
    });
  };
}

export const formatNumber = (value) => numberFormat.format(value);

/**
 * Wraps text from outside the page, like a search query or a name, in Unicode isolates, so a
 * Latin word inside Arabic text (or the other way round) does not reorder the text around it.
 */
export const isolate = (text) => `⁨${text}⁩`;

/** The same page in the other language, with the same query and hash. */
export function alternateUrl(url = location.href) {
  const target = new URL(url);
  const base = import.meta.env.BASE_URL;
  const path = target.pathname.startsWith(base) ? target.pathname.slice(base.length) : target.pathname.replace(/^\//, '');
  const page = path.replace(/^ar(\/|$)/, '');
  target.pathname = base + (otherLocale === 'ar' ? `ar/${page}` : page);
  return target.href;
}
