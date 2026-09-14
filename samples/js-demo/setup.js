// Shared by every page: all components and the header/footer menus.
// Styles load from a <link> in each page's <head> (style.css imports dda.css).

// Header logos. The white versions show on the home page's transparent header.
import governmentLogo from './assets/logos/government-of-dubai.svg';
import governmentLogoWhite from './assets/logos/government-of-dubai-white.svg';
import digitalDubaiLogo from './assets/logos/digital-logo.svg';
import digitalDubaiLogoWhite from './assets/logos/digital-logo-white.svg';

// Vite cannot bundle the lazy loader, so import every self-defining component.
import.meta.glob('/node_modules/@dubai-design-system/components-js/dist/components/dda-*.js', { eager: true });

// Placeholder images: placehold.co for logos and icons, picsum.photos for photos in the HTML.
const placeholder = (width, height, text) => `https://placehold.co/${width}x${height}?text=${encodeURIComponent(text)}`;

// Header and footer take their menus as JSON strings.
const link = (label, href = '#') => ({ label, href, subMenu: [] });

Object.assign(document.getElementById('site-header'), {
  firstLogoSrc: governmentLogo,
  firstLogoWhiteSrc: governmentLogoWhite,
  firstLogoAlt: 'Government of Dubai',
  secondLogoSrc: digitalDubaiLogo,
  secondLogoWhiteSrc: digitalDubaiLogoWhite,
  secondLogoAlt: 'Digital Dubai',
  // Header search submits a GET to this page, as /search.html?q=<query>.
  search_action: '/search.html',
  quickLinks: JSON.stringify([link('Home', '/'), link('Gallery', '/gallery.html'), link('About'), link('Contact')]),
  sideMenuItems: JSON.stringify([link('Home', '/'), link('Gallery', '/gallery.html')]),
});

// Each sticky footer item is an image link with a tooltip.
const icon = (prefix, label) => ({
  [`${prefix}Href`]: '#',
  [`${prefix}Src`]: placeholder(48, 48, label[0]),
  [`${prefix}Alt`]: label,
  [`${prefix}Tooltip`]: label,
});

Object.assign(document.getElementById('site-sticky-footer'), {
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

Object.assign(document.getElementById('site-footer'), {
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

// The page loads this module with blocking="render", so the browser waits for this await
// before its first paint. Components then appear already rendered, not one by one.
// The timeout stops a slow or broken component from keeping the page blank.
const components = [...document.querySelectorAll('*')].filter((el) => el.localName.startsWith('dda-'));
await Promise.race([
  Promise.all(components.map((el) => el.componentOnReady?.())),
  new Promise((resolve) => setTimeout(resolve, 2000)),
]);
