// Results page for the header search. dda-header submits a GET to /search.html?q=<query>.

// Sample data until a real search service exists.
const services = [
  { title: 'Pay traffic fines', description: 'Check and pay vehicle fines.', icon: 'directions_car' },
  { title: 'Renew vehicle registration', description: 'Renew the registration of a car or motorcycle.', icon: 'directions_car' },
  { title: 'Renew Emirates ID', description: 'Renew or replace an identity card.', icon: 'badge' },
  { title: 'Pay utility bills', description: 'Pay electricity and water bills.', icon: 'receipt_long' },
  { title: 'Renew trade licence', description: 'Renew a business trade licence.', icon: 'storefront' },
  { title: 'Apply for a visa', description: 'Apply for a residence or visit visa.', icon: 'flight' },
  { title: 'Housing assistance', description: 'Apply for a housing loan or grant.', icon: 'home' },
  { title: 'Book a health appointment', description: 'Book a visit at a public health centre.', icon: 'medical_services' },
];

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
  alert.setAttribute('variation', 'info');
  alert.setAttribute('type', 'primary');
  alert.setAttribute('title_text', 'No matching services');
  alert.setAttribute('description', 'Check the spelling, or use fewer words.');
  results.replaceWith(alert);
} else {
  summary.textContent = `${matches.length} ${matches.length === 1 ? 'result' : 'results'} for "${query}".`;
  for (const service of matches) {
    const card = document.createElement('dda-ui-card');
    card.setAttribute('maintitle', service.title);
    card.setAttribute('subtitle', service.description);
    card.setAttribute('icon', service.icon);
    card.setAttribute('linktext', 'Start service');
    card.setAttribute('link', '#');
    results.append(card);
  }
}

if (query) document.title = `${query} – Search results`;
