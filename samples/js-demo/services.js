// Browse services: every sample service as a card, filtered by category.
import { categories, serviceCard, services } from './services-data.js';
import { createT } from './i18n.js';

const t = createT({
  en: {
    all: 'All',
    allServices: { one: 'All {count} service.', other: 'All {count} services.' },
    servicesInCategory: { one: '{count} service in {category}.', other: '{count} services in {category}.' },
  },
  ar: {
    all: 'الكل',
    allServices: { zero: 'لا توجد خدمات.', one: 'جميع الخدمات: خدمة واحدة.', two: 'جميع الخدمات: خدمتان.', few: 'جميع الخدمات: {count} خدمات.', many: 'جميع الخدمات: {count} خدمة.', other: 'جميع الخدمات: {count} خدمة.' },
    servicesInCategory: { zero: 'لا توجد خدمات في {category}.', one: 'خدمة واحدة في {category}.', two: 'خدمتان في {category}.', few: '{count} خدمات في {category}.', many: '{count} خدمة في {category}.', other: '{count} خدمة في {category}.' },
  },
});

const categoryIds = [null, ...categories.map((c) => c.id)];
const tabLabels = [t('all'), ...categories.map((c) => c.name)];
const filter = document.getElementById('services-filter');
const list = document.getElementById('services-list');
const summary = document.getElementById('services-summary');

// ?category=business opens the page on that category.
const requestedId = new URLSearchParams(location.search).get('category');
const startIndex = categoryIds.indexOf(requestedId);
const initialIndex = Math.max(0, startIndex);

filter.setAttribute('items', JSON.stringify(tabLabels));
filter.setAttribute('selected_index', String(initialIndex));

const cards = services.map((service) => {
  const card = serviceCard(service, 2);
  card.dataset.category = service.category;
  return card;
});
list.append(...cards);

function showCategory(index) {
  const categoryId = categoryIds[index];
  let count = 0;
  for (const card of cards) {
    card.hidden = categoryId !== null && card.dataset.category !== categoryId;
    if (!card.hidden) count += 1;
  }

  if (index === 0) {
    summary.textContent = t('allServices', { count });
  } else {
    const categoryName = categories[index - 1].name;
    summary.textContent = t('servicesInCategory', { count, category: categoryName });
  }

  const url = new URL(location.href);
  if (index === 0) url.searchParams.delete('category');
  else url.searchParams.set('category', categoryId);
  history.replaceState(null, '', url);
}

showCategory(initialIndex);
filter.addEventListener('segmentChange', (event) => showCategory(event.detail));

// Load setup.js only now, so it also loads the card component for the cards above.
import('./setup.js');
