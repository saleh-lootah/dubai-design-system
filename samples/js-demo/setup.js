// Shared by every page: loads the components the page uses, sets the header/footer menus,
// then shows the page. Styles load from a <link> in each page's <head> (style.css imports dda.css).

// Header logos. The white versions show on the home page's transparent header.
import governmentLogo from './assets/logos/government-of-dubai.svg';
import governmentLogoWhite from './assets/logos/government-of-dubai-white.svg';
import digitalDubaiLogo from './assets/logos/digital-logo.svg';
import digitalDubaiLogoWhite from './assets/logos/digital-logo-white.svg';
import { setupPopups, HAPPINESS_HREF, PLATFORM_04_HREF } from './popups.js';
import { alternateUrl, createT, LOCALES, otherLocale } from './i18n.js';
import { applyComponentLabels } from './component-labels.js';
import { categoryName } from './services-data.js';

const t = createT({
  en: {
    home: 'Home',
    services: 'Services',
    allServices: 'All services',
    about: 'About',
    aboutUs: 'About us',
    aboutSample: 'About this sample',
    components: 'Components',
    componentGallery: 'Component gallery',
    searchResults: 'Search results',
    // The sample search in the About menu: a word that finds a service in this language.
    sampleSearch: 'visa',
    contact: 'Contact',
    contactUs: 'Contact us',
    gallery: 'Gallery',
    byTopic: 'By topic',
    homeAndHealth: 'Home and health',
    popular: 'Popular',
    transportText: 'Fines, registration and parking.',
    identityText: 'Emirates ID and visas.',
    businessText: 'Licences and companies.',
    housingText: 'Bills, tenancy and housing.',
    healthText: 'Appointments and health cards.',
    payFines: 'Pay traffic fines',
    payFinesText: 'Free, done at once.',
    renewId: 'Renew Emirates ID',
    renewIdText: 'AED 370, 5 working days.',
    renewVehicle: 'Renew vehicle registration',
    parkingPermit: 'Apply for a parking permit',
    renewTradeLicence: 'Renew trade licence',
    registerCompany: 'Register a new company',
    sendMessage: 'Send a message',
    sendMessageText: 'Use the contact form.',
    callUs: 'Call us',
    callUsText: 'Sunday to Thursday, 8:00 to 16:00.',
    visitUs: 'Visit us',
    visitUsText: 'Opening hours and address.',
    happiness: 'Happiness',
    accessibility: 'Accessibility',
    platform04: '04 platform',
    logo: 'Logo {n}',
    location: 'Location',
    news: 'News',
    aiAssistant: 'AI assistant',
    chat: 'Chat',
    governmentOfDubai: 'Government of Dubai',
    digitalDubai: 'Digital Dubai',
    logoPlaceholder: 'Logo placeholder',
    logoDescription: 'Logo description placeholder.',
    section: 'Section {n}',
    link: 'Link {n}',
  },
  ar: {
    home: 'الرئيسية',
    services: 'الخدمات',
    allServices: 'جميع الخدمات',
    about: 'من نحن',
    aboutUs: 'من نحن',
    aboutSample: 'عن هذا الموقع التجريبي',
    components: 'المكونات',
    componentGallery: 'معرض المكونات',
    searchResults: 'نتائج البحث',
    sampleSearch: 'تأشيرة',
    contact: 'اتصل بنا',
    contactUs: 'اتصل بنا',
    gallery: 'معرض المكونات',
    byTopic: 'حسب الموضوع',
    homeAndHealth: 'السكن والصحة',
    popular: 'الأكثر استخداماً',
    transportText: 'المخالفات وترخيص المركبات والمواقف.',
    identityText: 'الهوية الإماراتية والتأشيرات.',
    businessText: 'الرخص التجارية والشركات.',
    housingText: 'الفواتير والإيجار والسكن.',
    healthText: 'المواعيد والبطاقات الصحية.',
    payFines: 'دفع المخالفات المرورية',
    payFinesText: 'مجاناً، تُنجز فوراً.',
    renewId: 'تجديد الهوية الإماراتية',
    renewIdText: '370 درهم، 5 أيام عمل.',
    renewVehicle: 'تجديد ترخيص المركبة',
    parkingPermit: 'طلب تصريح مواقف',
    renewTradeLicence: 'تجديد الرخصة التجارية',
    registerCompany: 'تسجيل شركة جديدة',
    sendMessage: 'أرسل رسالة',
    sendMessageText: 'استخدم نموذج الاتصال.',
    callUs: 'اتصل بنا',
    callUsText: 'من الأحد إلى الخميس، من 8:00 إلى 16:00.',
    visitUs: 'زرنا',
    visitUsText: 'ساعات العمل والعنوان.',
    happiness: 'مؤشر السعادة',
    accessibility: 'إمكانية الوصول',
    platform04: 'منصة 04',
    logo: 'الشعار {n}',
    location: 'الموقع',
    news: 'الأخبار',
    aiAssistant: 'المساعد الذكي',
    chat: 'المحادثة',
    governmentOfDubai: 'حكومة دبي',
    digitalDubai: 'دبي الرقمية',
    logoPlaceholder: 'شعار تجريبي',
    logoDescription: 'وصف تجريبي للشعار.',
    section: 'القسم {n}',
    link: 'الرابط {n}',
  },
});

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
const category = (id) => `services.html?category=${id}`;

// The header menu shows each submenu type that dda-header supports:
//   Home     - a plain link.
//   Services - a 3.x mega menu (type "dda_main_megamenu"): several columns with titles.
//   About    - a 3.x dropdown (type "dda_default_submenu"): a list, and "Components" opens a third level.
//   Contact  - a 5.x mega menu (label, menuLabel, subMenu): one column of links with icons and descriptions.
//   Gallery  - a plain link.
const legacyLink = (label, url, extra = {}) => ({ headerMenuLabel: label, url, ...extra });
const megaLink = (label, url, icon, description) => ({ headerMenuLabel: label, url, quickLinksIcon: icon, description });
const categoryLink = (id, icon, description) => megaLink(categoryName(id), category(id), icon, description);
const headerLinks = [
  link(t('home'), './'),
  {
    type: 'dda_main_megamenu',
    headerMenuLabel: t('services'),
    url: 'services.html',
    children: [
      {
        title: t('byTopic'),
        items: [
          categoryLink('transport', 'directions_car', t('transportText')),
          categoryLink('identity-visas', 'badge', t('identityText')),
          categoryLink('business', 'business_center', t('businessText')),
        ],
      },
      {
        title: t('homeAndHealth'),
        items: [
          categoryLink('housing-utilities', 'home', t('housingText')),
          categoryLink('health', 'medical_services', t('healthText')),
        ],
      },
      {
        title: t('popular'),
        items: [
          megaLink(t('payFines'), service('traffic-fines'), 'receipt_long', t('payFinesText')),
          megaLink(t('renewId'), service('emirates-id'), 'badge', t('renewIdText')),
        ],
      },
    ],
  },
  {
    type: 'dda_default_submenu',
    headerMenuLabel: t('about'),
    url: 'about.html',
    defaultSubMenuTitle: t('aboutSample'),
    children: [
      legacyLink(t('aboutUs'), 'about.html'),
      legacyLink(t('services'), 'services.html'),
      {
        type: 'dda_default_submenu',
        headerMenuLabel: t('components'),
        url: 'gallery.html',
        defaultSubMenuTitle: t('components'),
        children: [legacyLink(t('componentGallery'), 'gallery.html'), legacyLink(t('searchResults'), `search.html?q=${encodeURIComponent(t('sampleSearch'))}`)],
      },
    ],
  },
  {
    label: t('contact'),
    href: 'contact.html',
    menuLabel: t('contactUs'),
    subMenu: [
      { title: t('sendMessage'), description: t('sendMessageText'), icon: 'mail', href: 'contact.html' },
      { title: t('callUs'), description: t('callUsText'), icon: 'call', href: 'contact.html' },
      { title: t('visitUs'), description: t('visitUsText'), icon: 'location_on', href: 'contact.html' },
    ],
  },
  link(t('gallery'), 'gallery.html'),
];

// The side menu nests: each subMenu item can have its own subMenu, with a headerLabel title.
const sideItem = (label, href, subMenu = []) => ({ label, href, subMenu });
const sideMenuLinks = [
  sideItem(t('home'), './'),
  sideItem(t('services'), 'services.html', [
    { headerLabel: t('services'), ...sideItem(t('allServices'), 'services.html') },
    sideItem(categoryName('transport'), category('transport'), [
      { headerLabel: categoryName('transport'), ...sideItem(t('payFines'), service('traffic-fines')) },
      sideItem(t('renewVehicle'), service('vehicle-registration')),
      sideItem(t('parkingPermit'), service('parking-permit')),
    ]),
    sideItem(categoryName('business'), category('business'), [
      { headerLabel: categoryName('business'), ...sideItem(t('renewTradeLicence'), service('trade-licence')) },
      sideItem(t('registerCompany'), service('new-company')),
    ]),
    sideItem(categoryName('health'), category('health')),
  ]),
  sideItem(t('about'), 'about.html'),
  sideItem(t('contact'), 'contact.html'),
  sideItem(t('gallery'), 'gallery.html'),
];

// Each sticky footer item is an image link with a tooltip. `initial` is the placeholder image's
// text, kept Latin: the placeholder service draws Latin text only.
const icon = (prefix, label, initial) => ({
  [`${prefix}Href`]: '#',
  [`${prefix}Src`]: placeholder(48, 48, initial),
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
    firstLogoAlt: t('governmentOfDubai'),
    secondLogoSrc: digitalDubaiLogo,
    secondLogoWhiteSrc: digitalDubaiLogoWhite,
    secondLogoAlt: t('digitalDubai'),
    // The default is "/", which on GitHub Pages is the domain root, not this site.
    firstLogoHref: './',
    secondLogoHref: './',
    // Header search submits a GET to this page, as /search.html?q=<query> (/ar/search.html in Arabic).
    search_action: 'search.html',
    quickLinks: JSON.stringify(headerLinks),
    sideMenuItems: JSON.stringify(sideMenuLinks),
    // The language button offers the other language, named in that language.
    language_text: LOCALES[otherLocale].name,
    language_lang: otherLocale,
  });
  // dda-header only emits languageSwitch; the site decides where it goes: the same page in the
  // other language, keeping the query (the service, the search, the page of the form).
  document.getElementById('site-header').addEventListener('languageSwitch', () => location.assign(alternateUrl()));

  setProps('site-sticky-footer', {
    // Happiness and 04 open sample popups (popups.js) instead of going to a page.
    ...icon('happinessIcon', t('happiness'), 'H'),
    happinessIconHref: HAPPINESS_HREF,
    ...icon('accessibilityIcon', t('accessibility'), 'A'),
    ...icon('servicesIcon', t('platform04'), '04'),
    servicesIconHref: PLATFORM_04_HREF,
    servicesIconText: t('platform04'),
    ...icon('firstLogo', t('logo', { n: 1 }), 'L'),
    ...icon('secondLogo', t('logo', { n: 2 }), 'L'),
    ...icon('thirdLogo', t('logo', { n: 3 }), 'L'),
    firstLogoSrc: placeholder(120, 40, 'Logo 1'),
    secondLogoSrc: placeholder(120, 40, 'Logo 2'),
    thirdLogoSrc: placeholder(120, 40, 'Logo 3'),
    hideMiddleSection: false,
    locationButtonHref: '#',
    locationLogoSrc: placeholder(48, 48, 'L'),
    locationButtonText: t('location'),
    newsButtonHref: '#',
    newsButtonSrc: placeholder(48, 48, 'N'),
    newsButtonText: t('news'),
    ...icon('aiIcon', t('aiAssistant'), 'A'),
    ...icon('chatIcon', t('chat'), 'C'),
  });

  setProps('site-footer', {
    heading_level: 2,
    logoSrc: placeholder(160, 48, 'Logo'),
    logoAlt: t('logoPlaceholder'),
    logoDescription: t('logoDescription'),
    footerSections: JSON.stringify(
      [1, 2, 3].map((section) => ({
        title: t('section', { n: section }),
        links: [1, 2, 3].map((n) => ({ label: t('link', { n }), href: '#' })),
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
    applyComponentLabels();
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
