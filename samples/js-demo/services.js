// Browse services: every sample service as a card, filtered by category.
import { categories, serviceCard, services } from './services-data.js';

const tabs = ['All', ...categories];
const filter = document.getElementById('services-filter');
const list = document.getElementById('services-list');
const summary = document.getElementById('services-summary');

// ?category=Transport opens the page on that category.
const requested = tabs.indexOf(new URLSearchParams(location.search).get('category'));
const startIndex = Math.max(0, requested);

filter.setAttribute('items', JSON.stringify(tabs));
filter.setAttribute('selected_index', String(startIndex));

const cards = services.map((service) => {
  const card = serviceCard(service);
  card.dataset.category = service.category;
  return card;
});
list.append(...cards);

function showCategory(index) {
  const category = tabs[index];
  let count = 0;
  for (const card of cards) {
    card.hidden = index !== 0 && card.dataset.category !== category;
    if (!card.hidden) count += 1;
  }
  summary.textContent = index === 0 ? `All ${count} services.` : `${count} services in ${category}.`;

  const url = new URL(location.href);
  if (index === 0) url.searchParams.delete('category');
  else url.searchParams.set('category', category);
  history.replaceState(null, '', url);
}

showCategory(startIndex);
filter.addEventListener('segmentChange', (event) => showCategory(event.detail));

// Load setup.js only now, so it also loads the card component for the cards above.
import('./setup.js');
