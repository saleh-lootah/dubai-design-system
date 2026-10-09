// Results page for the header search. dda-header submits a GET to /search.html?q=<query>.
import { createT, isolate } from './i18n.js';
import { serviceCard, services } from './services-data.js';

const t = createT({
  en: {
    emptySearch: 'Type a word in the header search, then press Enter.',
    resultsFor: { one: '{count} result for "{query}".', other: '{count} results for "{query}".' },
    noResults: 'No results for "{query}".',
    noMatchingServices: 'No matching services',
    noMatchingDescription: 'Check the spelling, or use fewer words.',
    title: '{query} – Search results',
  },
  ar: {
    emptySearch: 'اكتب كلمة في مربع البحث أعلى الصفحة، ثم اضغط مفتاح Enter.',
    resultsFor: { one: 'نتيجة واحدة للبحث عن «{query}».', two: 'نتيجتان للبحث عن «{query}».', few: '{count} نتائج للبحث عن «{query}».', many: '{count} نتيجة للبحث عن «{query}».', other: '{count} نتيجة للبحث عن «{query}».' },
    noResults: 'لا توجد نتائج للبحث عن «{query}».',
    noMatchingServices: 'لا توجد خدمات مطابقة',
    noMatchingDescription: 'تحقق من الإملاء، أو استخدم عدداً أقل من الكلمات.',
    title: '{query} – نتائج البحث',
  },
});

// Search ignores case, and the ways one Arabic word can be written: short vowels and other
// marks (tashkeel), tatweel, hamza on alef (أ إ آ), alef maqsura (ى) and ta marbuta (ة).
// Both languages use it: an Arabic page can be searched in English, and the other way round.
const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');

const query = (new URLSearchParams(location.search).get('q') ?? '').trim();
const words = normalize(query).split(/\s+/).filter(Boolean);
const matches = services.filter((service) => {
  const text = normalize(`${service.title} ${service.description}`);
  return words.every((word) => text.includes(word));
});

const summary = document.getElementById('search-summary');
const results = document.getElementById('search-results');

// textContent and setAttribute keep the query as plain text, never as markup.
if (!query) {
  summary.textContent = t('emptySearch');
} else if (matches.length === 0) {
  summary.textContent = t('noResults', { query: isolate(query) });
  const alert = document.createElement('dda-alert');
  alert.setAttribute('heading_level', '2');
  alert.setAttribute('variation', 'info');
  alert.setAttribute('type', 'primary');
  alert.setAttribute('title_text', t('noMatchingServices'));
  alert.setAttribute('description', t('noMatchingDescription'));
  results.replaceWith(alert);
} else {
  summary.textContent = t('resultsFor', { count: matches.length, query: isolate(query) });
  results.append(...matches.map((service) => serviceCard(service, 2)));
}

if (query) document.title = t('title', { query });

// Load setup.js only now: it loads the components that are on the page, including the cards above.
// A second <script> tag would not keep this order, because the build merges the page's scripts.
import('./setup.js');
