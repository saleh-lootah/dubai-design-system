// Shared by every page: loads the components the page uses, sets the header/footer menus,
// then shows the page. Styles load from a <link> in each page's <head> (style.css imports dda.css).

// Header logos. The white versions show on the home page's transparent header.
import governmentLogo from './assets/logos/government-of-dubai.svg';
import governmentLogoWhite from './assets/logos/government-of-dubai-white.svg';
import digitalDubaiLogo from './assets/logos/digital-logo.svg';
import digitalDubaiLogoWhite from './assets/logos/digital-logo-white.svg';
import { setupPopups, HAPPINESS_HREF, PLATFORM_04_HREF } from './popups.js';

// One lazy loader per self-defining component (Vite cannot bundle the package's lazy loader).
// Each component module also defines the components it uses inside, like dda-tooltip in dda-header.
const COMPONENTS = '/node_modules/@dubai-design-system/components-js/dist/components/';
const loaders = import.meta.glob('/node_modules/@dubai-design-system/components-js/dist/components/dda-*.js');

// Longest wait for components to render before the page shows anyway.
const RENDER_TIMEOUT = 3000;

// Placeholder images: placehold.co for logos and icons, picsum.photos for photos in the HTML.
const placeholder = (width, height, text) => `https://placehold.co/${width}x${height}?text=${encodeURIComponent(text)}`;

// Header and footer take their menus as JSON strings.
const link = (label, href = '#') => ({ label, href, subMenu: [] });
const service = (id) => `service.html?id=${id}`;
const category = (name) => `services.html?category=${encodeURIComponent(name)}`;

// The header menu shows each submenu type that dda-header supports:
//   Home     - a plain link.
//   Services - a 3.x mega menu (type "dda_main_megamenu"): several columns with titles.
//   About    - a 3.x dropdown (type "dda_default_submenu"): a list, and "Components" opens a third level.
//   Contact  - a 5.x mega menu (label, menuLabel, subMenu): one column of links with icons and descriptions.
//   Gallery  - a plain link.
const legacyLink = (label, url, extra = {}) => ({ headerMenuLabel: label, url, ...extra });
const megaLink = (label, url, icon, description) => ({ headerMenuLabel: label, url, quickLinksIcon: icon, description });
const headerLinks = [
  link('Home', './'),
  {
    type: 'dda_main_megamenu',
    headerMenuLabel: 'Services',
    url: 'services.html',
    children: [
      {
        title: 'By topic',
        items: [
          megaLink('Transport', category('Transport'), 'directions_car', 'Fines, registration and parking.'),
          megaLink('Identity and visas', category('Identity and visas'), 'badge', 'Emirates ID and visas.'),
          megaLink('Business', category('Business'), 'business_center', 'Licences and companies.'),
        ],
      },
      {
        title: 'Home and health',
        items: [
          megaLink('Housing and utilities', category('Housing and utilities'), 'home', 'Bills, tenancy and housing.'),
          megaLink('Health', category('Health'), 'medical_services', 'Appointments and health cards.'),
        ],
      },
      {
        title: 'Popular',
        items: [
          megaLink('Pay traffic fines', service('traffic-fines'), 'receipt_long', 'Free, done at once.'),
          megaLink('Renew Emirates ID', service('emirates-id'), 'badge', 'AED 370, 5 working days.'),
        ],
      },
    ],
  },
  {
    type: 'dda_default_submenu',
    headerMenuLabel: 'About',
    url: 'about.html',
    defaultSubMenuTitle: 'About this sample',
    children: [
      legacyLink('About us', 'about.html'),
      legacyLink('Services', 'services.html'),
      {
        type: 'dda_default_submenu',
        headerMenuLabel: 'Components',
        url: 'gallery.html',
        defaultSubMenuTitle: 'Components',
        children: [legacyLink('Component gallery', 'gallery.html'), legacyLink('Search results', 'search.html?q=visa')],
      },
    ],
  },
  {
    label: 'Contact',
    href: 'contact.html',
    menuLabel: 'Contact us',
    subMenu: [
      { title: 'Send a message', description: 'Use the contact form.', icon: 'mail', href: 'contact.html' },
      { title: 'Call us', description: 'Sunday to Thursday, 8:00 to 16:00.', icon: 'call', href: 'contact.html' },
      { title: 'Visit us', description: 'Opening hours and address.', icon: 'location_on', href: 'contact.html' },
    ],
  },
  link('Gallery', 'gallery.html'),
];

// The side menu nests: each subMenu item can have its own subMenu, with a headerLabel title.
const sideItem = (label, href, subMenu = []) => ({ label, href, subMenu });
const sideMenuLinks = [
  sideItem('Home', './'),
  sideItem('Services', 'services.html', [
    { headerLabel: 'Services', ...sideItem('All services', 'services.html') },
    sideItem('Transport', category('Transport'), [
      { headerLabel: 'Transport', ...sideItem('Pay traffic fines', service('traffic-fines')) },
      sideItem('Renew vehicle registration', service('vehicle-registration')),
      sideItem('Apply for a parking permit', service('parking-permit')),
    ]),
    sideItem('Business', category('Business'), [
      { headerLabel: 'Business', ...sideItem('Renew trade licence', service('trade-licence')) },
      sideItem('Register a new company', service('new-company')),
    ]),
    sideItem('Health', category('Health')),
  ]),
  sideItem('About', 'about.html'),
  sideItem('Contact', 'contact.html'),
  sideItem('Gallery', 'gallery.html'),
];

// Each sticky footer item is an image link with a tooltip.
const icon = (prefix, label) => ({
  [`${prefix}Href`]: '#',
  [`${prefix}Src`]: placeholder(48, 48, label[0]),
  [`${prefix}Alt`]: label,
  [`${prefix}Tooltip`]: label,
});

const componentsOnPage = () => [...document.querySelectorAll('*')].filter((el) => el.localName.startsWith('dda-'));

async function loadComponents() {
  const tags = new Set(componentsOnPage().map((el) => el.localName));
  await Promise.all([...tags].map((tag) => loaders[`${COMPONENTS}${tag}.js`]?.()));
}

// Props are set as attributes (firstLogoSrc -> first-logo-src) before the components load,
// so each component's first render already has its menus and logos.
const toAttributeName = (prop) => prop.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
function setProps(id, props) {
  const element = document.getElementById(id);
  for (const [prop, value] of Object.entries(props)) element.setAttribute(toAttributeName(prop), String(value));
}

function configureSiteChrome() {
  setProps('site-header', {
    firstLogoSrc: governmentLogo,
    firstLogoWhiteSrc: governmentLogoWhite,
    firstLogoAlt: 'Government of Dubai',
    secondLogoSrc: digitalDubaiLogo,
    secondLogoWhiteSrc: digitalDubaiLogoWhite,
    secondLogoAlt: 'Digital Dubai',
    // The default is "/", which on GitHub Pages is the domain root, not this site.
    firstLogoHref: './',
    secondLogoHref: './',
    // Header search submits a GET to this page, as /search.html?q=<query>.
    search_action: 'search.html',
    quickLinks: JSON.stringify(headerLinks),
    sideMenuItems: JSON.stringify(sideMenuLinks),
  });

  setProps('site-sticky-footer', {
    // Happiness and 04 open sample popups (popups.js) instead of going to a page.
    ...icon('happinessIcon', 'Happiness'),
    happinessIconHref: HAPPINESS_HREF,
    ...icon('accessibilityIcon', 'Accessibility'),
    ...icon('servicesIcon', '04 platform'),
    servicesIconHref: PLATFORM_04_HREF,
    servicesIconSrc: placeholder(48, 48, '04'),
    servicesIconText: '04 platform',
    ...icon('firstLogo', 'Logo 1'),
    ...icon('secondLogo', 'Logo 2'),
    ...icon('thirdLogo', 'Logo 3'),
    firstLogoSrc: placeholder(120, 40, 'Logo 1'),
    secondLogoSrc: placeholder(120, 40, 'Logo 2'),
    thirdLogoSrc: placeholder(120, 40, 'Logo 3'),
    hideMiddleSection: false,
    locationButtonHref: '#',
    locationLogoSrc: placeholder(48, 48, 'L'),
    locationButtonText: 'Location',
    newsButtonHref: '#',
    newsButtonSrc: placeholder(48, 48, 'N'),
    newsButtonText: 'News',
    ...icon('aiIcon', 'AI assistant'),
    ...icon('chatIcon', 'Chat'),
  });

  setProps('site-footer', {
    heading_level: 2,
    logoSrc: placeholder(160, 48, 'Logo'),
    logoAlt: 'Logo placeholder',
    logoDescription: 'Logo description placeholder.',
    footerSections: JSON.stringify(
      ['Section 1', 'Section 2', 'Section 3'].map((title) => ({
        title,
        links: [1, 2, 3].map((n) => ({ label: `Link ${n}`, href: '#' })),
      })),
    ),
    socialIcons: JSON.stringify([]),
  });
}

// The fixed "sample site" notice can wrap to more lines on a narrow screen. style.css moves the
// header and the page down by its height, so keep --demo-notice-height equal to that height.
function trackSampleNoticeHeight() {
  const notice = document.querySelector('.demo-sample-notice');
  if (!notice) return;
  const update = () => document.documentElement.style.setProperty('--demo-notice-height', `${notice.offsetHeight}px`);
  new ResizeObserver(update).observe(notice);
  update();
}

// style.css hides the page behind a spinner until <html> has the dda-ready class.
// Showing it only after every component renders means nothing pops in or jumps.
function showPage() {
  document.documentElement.classList.add('dda-ready');
  document.body.removeAttribute('aria-busy');
}

async function start() {
  document.body.setAttribute('aria-busy', 'true');
  try {
    trackSampleNoticeHeight();
    configureSiteChrome();
    setupPopups();
    await loadComponents();
    await Promise.race([
      Promise.all([
        ...componentsOnPage().map((el) => el.componentOnReady?.()),
        // Without the icon fonts, icons show as their names ("search", "arrow_forward").
        document.fonts.load('24px "Material Icons"'),
        document.fonts.load('24px "Material Symbols Outlined"'),
      ]),
      new Promise((resolve) => setTimeout(resolve, RENDER_TIMEOUT)),
    ]);
  } finally {
    showPage();
  }
}

start();
