// Results page for the header search. dda-header submits a GET to /search.html?q=<query>.
import { serviceCard, services } from './services-data.js';

const query = (new URLSearchParams(location.search).get('q') ?? '').trim();
const words = query.toLowerCase().split(/\s+/).filter(Boolean);
const matches = services.filter((service) => {
  const text = `${service.title} ${service.description}`.toLowerCase();
  return words.every((word) => text.includes(word));
});

const summary = document.getElementById('search-summary');
const results = document.getElementById('search-results');

// textContent and setAttribute keep the query as plain text, never as markup.
if (!query) {
  summary.textContent = 'Type a word in the header search, then press Enter.';
} else if (matches.length === 0) {
  summary.textContent = `No results for "${query}".`;
  const alert = document.createElement('dda-alert');
  alert.setAttribute('heading_level', '2');
  alert.setAttribute('variation', 'info');
  alert.setAttribute('type', 'primary');
  alert.setAttribute('title_text', 'No matching services');
  alert.setAttribute('description', 'Check the spelling, or use fewer words.');
  results.replaceWith(alert);
} else {
  summary.textContent = `${matches.length} ${matches.length === 1 ? 'result' : 'results'} for "${query}".`;
  results.append(...matches.map((service) => serviceCard(service, 2)));
}

if (query) document.title = `${query} – Search results`;

// Load setup.js only now: it loads the components that are on the page, including the cards above.
// A second <script> tag would not keep this order, because the build merges the page's scripts.
import('./setup.js');
