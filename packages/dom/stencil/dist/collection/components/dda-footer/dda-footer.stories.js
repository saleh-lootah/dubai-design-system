export default {
    title: 'Components/Footer',
    tags: ['autodocs'],
    component: 'dda-footer',
    parameters: {
        docs: {
            description: {
                component: `
  To use the \`dda-chip\` component, pass the following props:
  
  \`\`\`html
<dda-footer
    title="Welcome to your new digital reality."
    description="Let us help you take you from zero to serious business and beyond. Our no-strings attached free trial lets you test our product today."
    logo-src="https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg"
    logo-alt="Dubai-Digital-Authority"
    sign-up-button-text="Sign Up"
    login-button-text="Login"
    copyright-text="© 2023 Digitaldubai. All Rights Reserved."
    footer-sections='[{"title":"About Us","links":[{"label":"Our Competition","href":"#"},{"label":"Channels","href":"#"},{"label":"Scale","href":"#"},{"label":"Watch the Demo","href":"#"}]},{"title":"Products","links":[{"label":"Features","href":"#"},{"label":"Products","href":"#"},{"label":"Enterprise","href":"#"},{"label":"Solutions","href":"#"}]},{"title":"Resources","links":[{"label":"Partners","href":"#"},{"label":"Developers","href":"#"},{"label":"Community","href":"#"},{"label":"Apps","href":"#"}]},{"title":"Company","links":[{"label":"About Us","href":"#"},{"label":"Leadership","href":"#"},{"label":"News","href":"#"}]}]'
    social-icons='[{"href":"#","src":"https://img.icons8.com/?size=256&amp;id=118497&amp;format=png","alt":"Facebook"},{"href":"#","src":"https://img.icons8.com/?size=256&amp;id=118497&amp;format=png","alt":"Google"},{"href":"#","src":"https://img.icons8.com/?size=256&amp;id=118497&amp;format=png","alt":"Apple"},{"href":"#","src":"https://img.icons8.com/?size=256&amp;id=118497&amp;format=png","alt":"Instagram"}]'
    class="hydrated"
></dda-footer>
    \`\`\`
  `,
            },
        },
    },
};
const Template = (args) => `
    <dda-footer 
      title="${args.introTitle}"
      description="${args.introText}"
      logo-src="${args.logoUrl}"
      logo-alt="${args.logoAlt}"
      sign-up-button-text="${args.signUpLabel}"
      login-button-text="${args.loginLabel}"
      copyright-text="${args.copyrightText}"
      footer-sections='${JSON.stringify(args.footerSections)}'
      social-icons='${JSON.stringify(args.socialIcons)}'
    ></dda-footer>
  `;
export const Default = Template.bind({});
Default.args = {
    introTitle: "Welcome to your new digital reality.",
    introText: "Let us help you take you from zero to serious business and beyond. Our no-strings attached free trial lets you test our product today.",
    logoUrl: "https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg",
    logoAlt: "Dubai-Digital-Authority",
    signUpLabel: "Sign Up",
    loginLabel: "Login",
    copyrightText: "© 2023 Digitaldubai. All Rights Reserved.",
    footerSections: [
        {
            title: "About Us",
            links: [
                { label: "Our Competition", href: "#" },
                { label: "Channels", href: "#" },
                { label: "Scale", href: "#" },
                { label: "Watch the Demo", href: "#" },
            ]
        },
        {
            title: "Products",
            links: [
                { label: "Features", href: "#" },
                { label: "Products", href: "#" },
                { label: "Enterprise", href: "#" },
                { label: "Solutions", href: "#" },
            ]
        },
        {
            title: "Resources",
            links: [
                { label: "Partners", href: "#" },
                { label: "Developers", href: "#" },
                { label: "Community", href: "#" },
                { label: "Apps", href: "#" },
            ]
        },
        {
            title: "Company",
            links: [
                { label: "About Us", href: "#" },
                { label: "Leadership", href: "#" },
                { label: "News", href: "#" },
            ]
        },
    ],
    socialIcons: [
        { href: "#", src: "https://img.icons8.com/?size=256&id=118497&format=png", alt: "Facebook" },
        { href: "#", src: "https://img.icons8.com/?size=256&id=118497&format=png", alt: "Google" },
        { href: "#", src: "https://img.icons8.com/?size=256&id=118497&format=png", alt: "Apple" },
        { href: "#", src: "https://img.icons8.com/?size=256&id=118497&format=png", alt: "Instagram" },
    ],
};
//# sourceMappingURL=dda-footer.stories.js.map
