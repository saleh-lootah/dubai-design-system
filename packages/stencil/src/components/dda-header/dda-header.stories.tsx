export default {
  title: 'Components/Header',
  tags: ['autodocs'],
  component: 'dda-header',
  argTypes: {
    hamburger_menu_button_name: {
      control: {type: 'text'},
      description: 'Name for the hamburger menu button',
    },
    accessibility_button_name: {
      control: {type: 'text'},
      description: 'Name for the accessibility button',
    },
    search_button_name: {
      control: {type: 'text'},
      description: 'Name for the search button',
    },
    search_input_name: {
      control: {type: 'text'},
      description: 'Name for the search input',
    },
    language_button_name: {
      control: {type: 'text'},
      description: 'Name for the language button',
    },
    language_text: {
      control: {type: 'text'},
      description: 'Text for the language button',
    },
    close_menu_button_name: {
      control: {type: 'text'},
      description: 'Name for the close menu button',
    },
    close_accessibility_button_name: {
      control: {type: 'text'},
      description: 'Name for the close accessibility button',
    },
    close_sidebar_button_name: {
      control: {type: 'text'},
      description: 'Name for the close sidebar button',
    },
    toggle_accessibility_button_name: {
      control: {type: 'text'},
      description: 'Name for the toggle accessibility button',
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
    readSpeakerLink=""
    language_text="العربية"
    hamburger_menu_button_name="hamburger_menu_button_name"
    accessibility_button_name="accessibility_button_name"
    search_button_name="search_button_name"
    search_input_name="search_input_name"
    language_button_name="language_button_name"
    close_menu_button_name="close_menu_button_name"
    close_accessibility_button_name="close_accessibility_button_name"
    close_sidebar_button_name="close_sidebar_button_name"
    toggle_accessibility_button_name="toggle_accessibility_button_name"
    languageswitch="() => console.log('Language Switcher')"
    smtextsize="() => console.log('Small Text')"
    basetextsize="() => console.log('Base Text')"
    lgtextsize="() => console.log('Large Text')"
    normalcontrast="() => console.log('Normal Text')"
    blindcontrast="() => console.log('Blind Text')"
    redcontrast="() => console.log('Red Text')"
    greencontrast="() => console.log('Green Text')">
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
      language_text="${args.language_text}"
      hamburger_menu_button_name="${args.hamburger_menu_button_name}"
      accessibility_button_name="${args.accessibility_button_name}"
      search_button_name="${args.search_button_name}"
      search_input_name="${args.search_input_name}"
      language_button_name="${args.language_button_name}"
      close_menu_button_name="${args.close_menu_button_name}"
      close_accessibility_button_name="${args.close_accessibility_button_name}"
      close_sidebar_button_name="${args.close_sidebar_button_name}"
      toggle_accessibility_button_name="${args.toggle_accessibility_button_name}"
      readSpeakerLink="app-eu.readspeaker.com"
      languageSwitch="() => console.log('Language Switcher')"
      smTextSize="() => console.log('Small Text')"
      baseTextSize="() => console.log('Base Text')"
      lgTextSize="() => console.log('Large Text')"
       normalContrast="() => console.log('Normal Text')"
        blindContrast="() => console.log('Blind Text')"
         redContrast="() => console.log('Red Text')"
          greenContrast="() => console.log('Green Text')"
      quick-links='${JSON.stringify(args.quickLinks)}'
      side-menu-items='${JSON.stringify(args.sideMenuItems)}'
    ></dda-header>
        <script>
      const header = document.querySelector('dda-header');
      header.addEventListener('languageSwitch', ${args.languageSwitch});
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
  firstlogoSrc: "https://www.dof.gov.ae/Style Library/img/gov-logo.svg",
  firstLogoWhiteSrc: "https://www.dof.gov.ae/Style Library/img/gov-logo-white.svg",
  firstLogoAlt: "Dubai-Digital-Authority",
  secondLogoSrc: "https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg",
  secondLogoWhiteSrc: "https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg",
  secondLogoAlt: "Dubai-Digital-Authority",
  loginLink: "/login",
  language_text: "العربية",
  hamburger_menu_button_name:"hamburger_menu_button_name",
  accessibility_button_name:"accessibility_button_name",
  search_button_name:"search_button_name",
  search_input_name:"search_input_name",
  language_button_name:"language_button_name",
  close_menu_button_name:"close_menu_button_name",
  close_accessibility_button_name:"close_accessibility_button_name",
  close_sidebar_button_name:"close_sidebar_button_name",
  toggle_accessibility_button_name:"toggle_accessibility_button_name",
  languageSwitch: "() => console.log('Language Switcher')",
  smTextSize: "() => console.log('Small Text')",
  baseTextSize: "() => console.log('Base Text')",
  lgTextSize: "() => console.log('Large Text')",
  normalContrast: "() => console.log('Normal Contrast')",
  blindContrast: "() => console.log('Blind Contrast')",
  redContrast: "() => console.log('Red Contrast')",
  greenContrast: "() => console.log('Green Contrast')",
  readSpeakerLink: "app-eu.readspeaker.com",
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
        { headerLabel: 'Initiatives', label: 'Submenu-1', href: '#', subMenu: [
          { headerLabel: 'Initiatives', label: 'Submenu-2', href: '#', subMenu: [
            { headerLabel: 'Initiatives', label: 'Submenu-4', href: '#' }
          ] },
          { headerLabel: 'Initiatives', label: 'Submenu-3', href: '#' }
        ] },
        { headerLabel: 'Initiatives', label: 'Submenu-1', href: '#', subMenu: [
          { headerLabel: 'Initiatives', label: 'Submenu-2', href: '#', subMenu: [
            { headerLabel: 'Initiatives', label: 'Submenu-4', href: '#' }
          ] },
          { headerLabel: 'Initiatives', label: 'Submenu-3', href: '#' }
        ] },
      ],
    },
    { label: 'Services', href: '#', subMenu: [
      { headerLabel: 'Service', label: 'Service-1', href: '#' },
      { headerLabel: 'Service', label: 'Service-2', href: '#' },
    ]},
    { label: 'Data', href: '#', subMenu: [] },
    { label: 'Government Services', href: '#', subMenu: [] },
    { label: 'Investor Relations', href: '#', subMenu: [] },
    { label: 'Locations', href: '#', subMenu: [] },
    { label: 'Newsroom', href: '#', subMenu: [] },
    { label: 'Contact Us', href: '#', subMenu: [] },
  ],
};
