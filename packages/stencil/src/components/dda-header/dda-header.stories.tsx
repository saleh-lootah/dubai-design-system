export default {
  title: 'Components/Header',
  tags: ['autodocs'],
  component: 'dda-header',
  argTypes: {
    loginText: {
      control: { type: 'text' },
      description: 'Label of the Login link in the desktop toolbar and the side menu (default Login)',
    },
    loginIcon: {
      control: { type: 'text' },
      description: 'Material Symbols icon name of the Login link (default sentiment_satisfied)',
    },
    hide_login: {
      control: { type: 'boolean' },
      description: 'Removes the Login link from the desktop toolbar and the side menu',
    },
    hamburger_menu_button_name: {
      control: { type: 'text' },
      description: 'Name for the hamburger menu button',
    },
    accessibility_button_name: {
      control: { type: 'text' },
      description: 'Name for the accessibility button',
    },
    search_button_name: {
      control: { type: 'text' },
      description: 'Name for the search button',
    },
    search_input_name: {
      control: { type: 'text' },
      description: 'Query parameter name for the search input (default q)',
    },
    search_action: {
      control: { type: 'text' },
      description: 'Results page URL. A search does a GET to it unless searchSubmit is cancelled',
    },
    language_button_name: {
      control: { type: 'text' },
      description: 'Name for the language button',
    },
    language_text: {
      control: { type: 'text' },
      description: 'Text for the language button',
    },
    close_menu_button_name: {
      control: { type: 'text' },
      description: 'Name for the close menu button',
    },
    close_accessibility_button_name: {
      control: { type: 'text' },
      description: 'Name for the close accessibility button',
    },
    close_sidebar_button_name: {
      control: { type: 'text' },
      description: 'Name for the close sidebar button',
    },
    toggle_accessibility_button_name: {
      control: { type: 'text' },
      description: 'Name for the toggle accessibility button',
    },
    // 3.x accessibility-panel and toolbar text props (Tasks 2-4): every one falls back to the
    // English default when it is absent, and removes the text it names when it is empty ("").
    read_speaker_link: {
      control: { type: 'text' },
      description: '3.x name of `readSpeakerLink`, as an attribute: `read_speaker_link`. `readSpeakerLink` wins when both are set.',
    },
    contrast_title: {
      control: { type: 'text' },
      description: 'Heading of the contrast column in the accessibility panel. Default: `Contrast`. An empty value removes the heading.',
    },
    contrast_description: {
      control: { type: 'text' },
      description: 'Text above the contrast options. Default: `Select your preferred contrast setting`.',
    },
    contrast_normal_text: {
      control: { type: 'text' },
      description: 'Label of the normal contrast option. Default: `Normal`.',
    },
    contrast_noraml_text: {
      control: { type: 'text' },
      description: '3.x spelling of `contrast_normal_text`. `contrast_normal_text` wins when both are set.',
    },
    contrast_color_blind_text: {
      control: { type: 'text' },
      description: 'Label of the colour-blind contrast option. Default: `Colours Blind`.',
    },
    contrast_red_weakness_text: {
      control: { type: 'text' },
      description: 'Label of the red-weakness contrast option. Default: `Red Weakness`.',
    },
    contrast_green_weakness_text: {
      control: { type: 'text' },
      description: 'Label of the green-weakness contrast option. Default: `Green Weakness`.',
    },
    screen_reader_title: {
      control: { type: 'text' },
      description: 'Heading of the screen reader column. Default: `Screen Reader`.',
    },
    screen_reader_description: {
      control: { type: 'text' },
      description: 'Text in the screen reader column. Default: `Listen to the content of the page by clicking play or listen`.',
    },
    screen_reader_link_label: {
      control: { type: 'text' },
      description: 'Accessible name of the ReadSpeaker play link. Default: `Listen to this page using ReadSpeaker`.',
    },
    text_size_title: {
      control: { type: 'text' },
      description: 'Heading of the text size column. Default: `Text Size`.',
    },
    text_size_description: {
      control: { type: 'text' },
      description: 'Text in the text size column. Default: `Use the buttons below to increase or decrease the text size`.',
    },
    selected_contrast: {
      control: { type: 'text' },
      description: 'The contrast option shown as selected. The header updates it when the user picks an option. Default: `normal`.',
    },
    selected_text_size: {
      control: { type: 'text' },
      description: 'The text size button shown as selected (`default-primary`). The header updates it on each click. Default: none.',
    },
    accessibility_tooltip: {
      control: { type: 'text' },
      description: 'Tooltip of the desktop accessibility button. Default: `Accessibility`.',
    },
    accessibility_button_text: {
      control: { type: 'text' },
      description: 'Accessible name (visually hidden text) of both accessibility buttons. Default: `Accessibility`.',
    },
    accessibility_button_id: {
      control: { type: 'text' },
      description: '`id` of the desktop accessibility button. The side-menu button gets this id plus `-sidemenu`.',
    },
    accessibility_button_icon_family: {
      control: { type: 'text' },
      description: '`class` of the accessibility button icon. Default: `material-icons  material-symbols-outlined`.',
    },
    accessibility_button_icon_name: {
      control: { type: 'text' },
      description: 'Material icon name of the accessibility buttons. Default: `accessibility`.',
    },
    search_tooltip: {
      control: { type: 'text' },
      description: 'Tooltip of the desktop search. Default: `Search`.',
    },
    search_input_placeholder: {
      control: { type: 'text' },
      description: 'Placeholder of the search inputs. Default: the `searchText` value, else `Search`.',
    },
    language_tooltip: {
      control: { type: 'text' },
      description: 'Tooltip of the desktop language button. Default: `Language`.',
    },
    login_tooltip: {
      control: { type: 'text' },
      description: 'Tooltip of the desktop Login link. Default: the Login label.',
    },
    usePredesignedAccessibilityMenu: {
      control: { type: 'text' },
      description:
        'When `false`, the header renders no accessibility panel; the buttons only emit `accessibilitymenufunctionality`, so the page can open its own panel. Default: `true`.',
    },
    sideMainMenuTitle: {
      control: { type: 'text' },
      description: 'Title above the side-menu links. Default: `Quick Links`. An empty value removes it.',
    },
    sideOtherMenuTitle: {
      control: { type: 'text' },
      description: 'Title above the "other" side-menu links. It shows only when there are other links.',
    },
    otherMenuItems: {
      control: { type: 'text' },
      description: 'Second list in the side menu. JSON array (or array property) of `{ label, href, active }`; `active: "true"` marks the current page.',
    },
    hideOtherMenu: {
      control: { type: 'text' },
      description: 'Hides the "other" side-menu links and their title. Default: `false`.',
    },
    mobileMenuSearchId: {
      control: { type: 'text' },
      description: '`id` of the mobile search control.',
    },
    mobileMenuSearchUrl: {
      control: { type: 'text' },
      description:
        "3.x mobile search: when set, the mobile search is a plain link to this URL (with `mobileMenuSearchId` as its id) and the header's own search panel is not rendered.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
To use the \`dda-header\` component, pass the following props:

\`\`\`html
<dda-header
    first-logo-src="assets/img/government-of-dubai.svg"
    first-logo-white-src="assets/img/government-of-dubai-white.svg"
    first-logo-alt="Dubai-Digital-Authority"
    second-logo-src="digital-logo.svg"
    second-logo-white-src="digital-logo-white.svg"
    second-logo-alt="Dubai-Digital-Authority"
    login-link="/login"
    read-speaker-link=""
    language_text="العربية"
    hamburger_menu_button_name="hamburger_menu_button_name"
    accessibility_button_name="accessibility_button_name"
    search_button_name="search_button_name"
    search_input_name="search_input_name"
    language_button_name="language_button_name"
    close_menu_button_name="close_menu_button_name"
    close_accessibility_button_name="close_accessibility_button_name"
    close_sidebar_button_name="close_sidebar_button_name"
    toggle_accessibility_button_name="toggle_accessibility_button_name">
</dda-header>
  \`\`\`
`,
      },
    },
  },
};

const Template = args => `
    <dda-header 
      first-logo-src="${args.firstlogoSrc}"
      first-logo-white-src="${args.firstLogoWhiteSrc}"
      first-logo-alt="${args.firstLogoAlt}"
      second-logo-src="${args.secondLogoSrc}"
      second-logo-white-src="${args.secondLogoWhiteSrc}"
      second-logo-alt="${args.secondLogoAlt}"
      login-link="${args.loginLink}"
      login-text="${args.loginText}"
      login-icon="${args.loginIcon}"
      ${args.hide_login ? 'hide_login' : ''}
      language_text="${args.language_text}"
      hamburger_menu_button_name="${args.hamburger_menu_button_name}"
      accessibility_button_name="${args.accessibility_button_name}"
      search_button_name="${args.search_button_name}"
      search_input_name="${args.search_input_name}"
      search_action="${args.search_action}"
      language_button_name="${args.language_button_name}"
      close_menu_button_name="${args.close_menu_button_name}"
      close_accessibility_button_name="${args.close_accessibility_button_name}"
      close_sidebar_button_name="${args.close_sidebar_button_name}"
      toggle_accessibility_button_name="${args.toggle_accessibility_button_name}"
      read-speaker-link="${args.readSpeakerLink}"
      quick-links='${JSON.stringify(args.quickLinks)}'
      side-menu-items='${JSON.stringify(args.sideMenuItems)}'
    ></dda-header>
        <script>
      const header = document.querySelector('dda-header');
      header.addEventListener('languageSwitch', ${args.languageSwitch});
      header.addEventListener('searchSubmit', (event) => console.log('Search', event.detail.query));
       header.addEventListener('smTextSize', ${args.smTextSize});
              header.addEventListener('baseTextSize', ${args.baseTextSize});
                     header.addEventListener('lgTextSize', ${args.lgTextSize});
                      header.addEventListener('normalContrast', ${args.normalContrast});
                       header.addEventListener('blindContrast', ${args.blindContrast});
                        header.addEventListener('redContrast', ${args.redContrast});
                         header.addEventListener('greenContrast', ${args.greenContrast});
    </script>
  `;

export const Default = Template.bind({});
Default.args = {
  firstlogoSrc: 'https://www.dof.gov.ae/Style Library/img/gov-logo.svg',
  firstLogoWhiteSrc: 'https://www.dof.gov.ae/Style Library/img/gov-logo-white.svg',
  firstLogoAlt: 'Dubai-Digital-Authority',
  secondLogoSrc: 'https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg',
  secondLogoWhiteSrc: 'https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg',
  secondLogoAlt: 'Dubai-Digital-Authority',
  loginLink: '/login',
  loginText: 'Login',
  loginIcon: 'sentiment_satisfied',
  hide_login: false,
  language_text: 'العربية',
  hamburger_menu_button_name: 'hamburger_menu_button_name',
  accessibility_button_name: 'accessibility_button_name',
  search_button_name: 'search_button_name',
  search_input_name: 'q',
  search_action: '',
  language_button_name: 'language_button_name',
  close_menu_button_name: 'close_menu_button_name',
  close_accessibility_button_name: 'close_accessibility_button_name',
  close_sidebar_button_name: 'close_sidebar_button_name',
  toggle_accessibility_button_name: 'toggle_accessibility_button_name',
  languageSwitch: "() => console.log('Language Switcher')",
  smTextSize: "() => console.log('Small Text')",
  baseTextSize: "() => console.log('Base Text')",
  lgTextSize: "() => console.log('Large Text')",
  normalContrast: "() => console.log('Normal Contrast')",
  blindContrast: "() => console.log('Blind Contrast')",
  redContrast: "() => console.log('Red Contrast')",
  greenContrast: "() => console.log('Green Contrast')",
  readSpeakerLink: 'app-eu.readspeaker.com',
  quickLinks: [
    { label: 'Home', href: '#', subMenu: [] },
    {
      label: 'Services',
      menuLabel: 'Services',
      href: '#',
      subMenu: [
        { title: 'Web Development', description: 'Build and maintain websites', icon: 'sentiment_satisfied', href: '#' },
        { title: 'SEO Services', description: 'Improve your site ranking', icon: 'sentiment_satisfied', href: '#' },
      ],
    },
    { label: 'About', href: '#', subMenu: [] },
    { label: 'Contact', href: '#', subMenu: [] },
  ],

  sideMenuItems: [
    { label: 'Home', href: '#', subMenu: [] },
    {
      label: 'Initiatives',
      href: '#',
      subMenu: [
        {
          headerLabel: 'Initiatives',
          label: 'Submenu-1',
          href: '#',
          subMenu: [
            { headerLabel: 'Initiatives', label: 'Submenu-2', href: '#', subMenu: [{ headerLabel: 'Initiatives', label: 'Submenu-4', href: '#' }] },
            { headerLabel: 'Initiatives', label: 'Submenu-3', href: '#' },
          ],
        },
        {
          headerLabel: 'Initiatives',
          label: 'Submenu-1',
          href: '#',
          subMenu: [
            { headerLabel: 'Initiatives', label: 'Submenu-2', href: '#', subMenu: [{ headerLabel: 'Initiatives', label: 'Submenu-4', href: '#' }] },
            { headerLabel: 'Initiatives', label: 'Submenu-3', href: '#' },
          ],
        },
      ],
    },
    {
      label: 'Services',
      href: '#',
      subMenu: [
        { headerLabel: 'Service', label: 'Service-1', href: '#' },
        { headerLabel: 'Service', label: 'Service-2', href: '#' },
      ],
    },
    { label: 'Data', href: '#', subMenu: [] },
    { label: 'Government Services', href: '#', subMenu: [] },
    { label: 'Investor Relations', href: '#', subMenu: [] },
    { label: 'Locations', href: '#', subMenu: [] },
    { label: 'Newsroom', href: '#', subMenu: [] },
    { label: 'Contact Us', href: '#', subMenu: [] },
  ],
};

// A site without sign-in: hide_login removes the Login link from the toolbar and the side menu.
export const WithoutLogin = Template.bind({});
WithoutLogin.args = {
  ...Default.args,
  hide_login: true,
};

// A page built on the 3.x attributes, in Arabic: every settable text in the accessibility panel,
// the toolbar and the side menu comes from an attribute. A few close-button labels (for example
// "Close Sidebar") have no attribute and stay fixed English text.
export const Arabic3x = () => `
  <div dir="rtl" lang="ar">
    <dda-header
      contrast_title="تباين الألوان" contrast_description="حدد إعداد تباين الألوان المفضل لديك"
      contrast_noraml_text="الألوان العادية" contrast_color_blind_text="عمى الألوان"
      contrast_red_weakness_text="ضعف أحمر" contrast_green_weakness_text="الضعف الأخضر"
      screen_reader_title="قارئ الشاشة" screen_reader_description="استمع إلى محتوى الصفحة بالضغط على تشغيل أو استماع"
      read_speaker_link="#" text_size_title="حجم النص" text_size_description="استخدم الأزرار أدناه لزيادة أو تقليل حجم النص"
      accessibility_tooltip="إمكانية الوصول" accessibility_button_text="إمكانية الوصول إلى الموقع الإلكتروني"
      accessibility_button_icon_name="accessible_forward"
      search_tooltip="بحث" search_input_placeholder="يبحث" language_text="English" language_lang="en" language_tooltip="تغيير اللغة"
      login-text="" side-main-menu-title="قائمة الموقع" menu_button_label="القائمة"
      quick-links='${JSON.stringify([
        { type: 'dda_default_submenu', headerMenuLabel: 'الصفحة الرئيسية', url: '#', children: [] },
        {
          type: 'dda_default_submenu',
          headerMenuLabel: 'عن الدائرة',
          url: '#',
          children: [
            { type: 'dda_default_submenu', headerMenuLabel: 'استراتيجية الدائرة', url: '#', children: [] },
            { type: 'dda_default_submenu', headerMenuLabel: 'السياسات', url: '#', children: [{ headerMenuLabel: 'سياسة الجودة', url: '#', children: [] }] },
          ],
        },
      ])}'
    ></dda-header>
  </div>`;
