// Home page: popular-service facts, the life-moment route and the topic index, all from
// services-data.js, so the home page cannot show a fee or a time that the service page does not.
import { categories, formatFee, serviceUrl, services } from './services-data.js';

const byId = Object.fromEntries(services.map((service) => [service.id, service]));

// The services a life moment needs, in the order a person applies for them.
const moments = [
  {
    label: 'Moving to Dubai',
    intro: 'Get a visa first. You need it for every other step.',
    route: ['visa', 'emirates-id', 'tenancy-contract', 'utility-bills', 'health-card'],
  },
  {
    label: 'Starting a business',
    intro: 'Register the company, then an office for it.',
    route: ['new-company', 'tenancy-contract', 'utility-bills', 'parking-permit'],
  },
  {
    label: 'Owning a car',
    intro: 'The services a car owner uses each year.',
    route: ['vehicle-registration', 'parking-permit', 'traffic-fines'],
  },
];

// "3 working days" -> 3; "Immediately" -> 0.
const workingDays = (service) => Number.parseInt(service.time, 10) || 0;
const timeText = (service) => (workingDays(service) === 0 ? 'Done at once' : service.time);
const facts = (service) => `${formatFee(service.fee)}, ${timeText(service).toLowerCase()}`;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function fillQuickLinks() {
  for (const link of document.querySelectorAll('.link-item[data-service]')) {
    const service = byId[link.dataset.service];
    if (service) link.querySelector('.subtitle').textContent = facts(service);
  }
}

const route = document.getElementById('moment-route');
const intro = document.getElementById('moment-intro');
const total = document.getElementById('moment-total');

function showMoment(index, { animate = false } = {}) {
  const moment = moments[index];
  const stops = moment.route.map((id) => byId[id]);

  intro.textContent = moment.intro;
  route.replaceChildren(
    ...stops.map((service, position) => {
      const stop = element('li', 'home-stop');
      // Each line segment draws after the one before it.
      stop.style.setProperty('--stop', position);
      const link = element('a', 'home-stop-link', service.title);
      link.href = serviceUrl(service);
      stop.append(link, element('span', 'home-stop-facts', facts(service)));
      return stop;
    }),
  );

  const fees = stops.reduce((sum, service) => sum + service.fee, 0);
  const days = stops.reduce((sum, service) => sum + workingDays(service), 0);
  total.textContent = `${stops.length} services. ${formatFee(fees)} in fees and about ${days} working days, if you apply for each one after the one before it.`;

  // After a selection, draw the line again, so the change is visible. Not on the first render:
  // the page is still hidden then. style.css skips this for reduced motion.
  route.classList.remove('is-drawn');
  if (animate) {
    void route.offsetWidth;
    route.classList.add('is-drawn');
  }
}

function fillTopics() {
  const list = document.getElementById('topic-list');
  list.append(
    ...categories.map((category) => {
      const inCategory = services.filter((service) => service.category === category);
      const topic = element('div', 'home-topic');
      const heading = element('h3', 'home-topic-title');
      const link = element('a', '', category);
      link.href = `services.html?category=${encodeURIComponent(category)}`;
      heading.append(link);

      const items = element('ul', 'home-topic-services');
      items.append(
        ...inCategory.map((service) => {
          const item = element('li');
          const serviceLink = element('a', '', service.title);
          serviceLink.href = serviceUrl(service);
          item.append(serviceLink);
          return item;
        }),
      );
      topic.append(heading, items);
      return topic;
    }),
  );
}

fillQuickLinks();
fillTopics();

const filter = document.getElementById('moments-filter');
filter.setAttribute('items', JSON.stringify(moments.map((moment) => moment.label)));
filter.setAttribute('selected_index', '0');
filter.addEventListener('segmentChange', (event) => showMoment(event.detail, { animate: true }));
showMoment(0);

// Load setup.js only now, so it also loads the components that this script added.
import('./setup.js');
