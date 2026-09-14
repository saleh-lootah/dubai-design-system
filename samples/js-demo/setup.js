// Shared by every page: loads the components the page uses, sets the header/footer menus,
// then shows the page. Styles load from a <link> in each page's <head> (style.css imports dda.css).

// Header logos. The white versions show on the home page's transparent header.
import governmentLogo from './assets/logos/government-of-dubai.svg';
import governmentLogoWhite from './assets/logos/government-of-dubai-white.svg';
import digitalDubaiLogo from './assets/logos/digital-logo.svg';
import digitalDubaiLogoWhite from './assets/logos/digital-logo-white.svg';

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
const siteLinks = [
  link('Home', './'),
  link('Services', 'services.html'),
  link('About', 'about.html'),
  link('Contact', 'contact.html'),
  link('Gallery', 'gallery.html'),
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
    // Header search submits a GET to this page, as /search.html?q=<query>.
    search_action: 'search.html',
    quickLinks: JSON.stringify(siteLinks),
    sideMenuItems: JSON.stringify(siteLinks),
  });

  setProps('site-sticky-footer', {
    ...icon('happinessIcon', 'Happiness'),
    ...icon('accessibilityIcon', 'Accessibility'),
    ...icon('servicesIcon', 'Services'),
    servicesIconText: 'Services',
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

// style.css hides the page behind a spinner until <html> has the dda-ready class.
// Showing it only after every component renders means nothing pops in or jumps.
function showPage() {
  document.documentElement.classList.add('dda-ready');
  document.body.removeAttribute('aria-busy');
}

async function start() {
  document.body.setAttribute('aria-busy', 'true');
  try {
    configureSiteChrome();
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
