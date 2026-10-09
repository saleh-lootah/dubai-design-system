// Home page: popular-service facts, the life-moment route and the topic index, all from
// services-data.js, so the home page cannot show a fee or a time that the service page does not.
import { categories, formatDays, formatFee, formatTime, serviceUrl, services } from './services-data.js';
import { createT } from './i18n.js';

const t = createT({
  en: {
    momentLabel0: 'Moving to Dubai',
    momentIntro0: 'Get a visa first. You need it for every other step.',
    momentLabel1: 'Starting a business',
    momentIntro1: 'Register the company, then an office for it.',
    momentLabel2: 'Owning a car',
    momentIntro2: 'The services a car owner uses each year.',
    // The facts line reads "AED 370, 5 working days" or "Free, done at once".
    facts: '{fee}, {time}',
    doneAtOnce: 'done at once',
    services: { one: '{count} service', other: '{count} services' },
    totalRoute: '{services}. {fee} in fees and about {days}, if you apply for each one after the one before it.',
  },
  ar: {
    momentLabel0: 'الانتقال إلى دبي',
    momentIntro0: 'احصل على تأشيرة أولاً. تحتاج إليها في كل خطوة أخرى.',
    momentLabel1: 'بدء نشاط تجاري',
    momentIntro1: 'سجّل الشركة، ثم سجّل لها مكتباً.',
    momentLabel2: 'امتلاك سيارة',
    momentIntro2: 'الخدمات التي يستخدمها مالك السيارة كل سنة.',
    facts: '{fee}، {time}',
    doneAtOnce: 'تُنجز فوراً',
    services: { one: 'خدمة واحدة', two: 'خدمتان', few: '{count} خدمات', many: '{count} خدمة', other: '{count} خدمة' },
    totalRoute: '{services}. الرسوم {fee}، والمدة {days} تقريباً، إذا قدّمت طلب كل خدمة بعد إنجاز الخدمة التي قبلها.',
  },
});

const byId = Object.fromEntries(services.map((service) => [service.id, service]));

// The services a life moment needs, in the order a person applies for them.
const moments = [
  {
    labelKey: 'momentLabel0',
    introKey: 'momentIntro0',
    route: ['visa', 'emirates-id', 'tenancy-contract', 'utility-bills', 'health-card'],
  },
  {
    labelKey: 'momentLabel1',
    introKey: 'momentIntro1',
    route: ['new-company', 'tenancy-contract', 'utility-bills', 'parking-permit'],
  },
  {
    labelKey: 'momentLabel2',
    introKey: 'momentIntro2',
    route: ['vehicle-registration', 'parking-permit', 'traffic-fines'],
  },
];

const facts = (service) => t('facts', { fee: formatFee(service.fee), time: service.days === 0 ? t('doneAtOnce') : formatTime(service) });

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

  intro.textContent = t(moment.introKey);
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
  const days = stops.reduce((sum, service) => sum + service.days, 0);
  total.textContent = t('totalRoute', {
    services: t('services', { count: stops.length }),
    fee: formatFee(fees),
    days: formatDays(days),
  });

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
      const inCategory = services.filter((service) => service.category === category.id);
      const topic = element('div', 'home-topic');
      const heading = element('h3', 'home-topic-title');
      const link = element('a', '', category.name);
      link.href = `services.html?category=${encodeURIComponent(category.id)}`;
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
filter.setAttribute('items', JSON.stringify(moments.map((moment) => t(moment.labelKey))));
filter.setAttribute('selected_index', '0');
filter.addEventListener('segmentChange', (event) => showMoment(event.detail, { animate: true }));
showMoment(0);

// Load setup.js only now, so it also loads the components that this script added.
import('./setup.js');
