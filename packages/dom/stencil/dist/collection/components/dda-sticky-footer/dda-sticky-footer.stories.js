import digital_logo from "../../../public_images/digital-logo.svg";
import digital_ai from "../../../public_images/DubaiAI.svg";
import accessibility_icon from "../../../public_images/icn-complaints.svg";
import happy_icon from "../../../public_images/icn-happy.svg";
import chat_icn from "../../../public_images/icn-chat_bubble_outline.svg";
import grid_view from "../../../public_images/icn-grid-view.svg";
import location_pin from "../../../public_images/icn-location-pin.svg";
import news_pin from "../../../public_images/icn-news.svg";
export default {
    title: 'Components/Sticky Footer',
    tags: ['autodocs'],
    argTypes: {
        hideMiddleSection: {
            control: { type: 'boolean' },
            description: 'Hides the middle section of the footer',
        }
    },
    component: 'dda-sticky-footer',
    parameters: {
        docs: {
            description: {
                component: 'Sticky footer with configurable props.',
            },
        },
    },
};
const Template = args => `
  <dda-sticky-footer
    happiness-icon-href="${args.happinessIconHref}"
    happiness-icon-src="${args.happinessIconSrc}"
    happiness-icon-alt="${args.happinessIconAlt}"
    happiness-icon-tooltip="${args.happinessIconTooltip}"

    accessibility-icon-href="${args.accessibilityIconHref}"
    accessibility-icon-src="${args.accessibilityIconSrc}"
    accessibility-icon-alt="${args.accessibilityIconAlt}"
    accessibility-icon-tooltip="${args.accessibilityIconTooltip}"

    services-icon-href="${args.servicesIconHref}"
    services-icon-src="${args.servicesIconSrc}"
    services-icon-alt="${args.servicesIconAlt}"
    services-icon-tooltip="${args.servicesIconTooltip}"
    services-icon-text="${args.servicesIconText}"

    first-logo-href="${args.firstLogoHref}"
    first-logo-src="${args.firstLogoSrc}"
    first-logo-alt="${args.firstLogoAlt}"
    first-logo-tooltip="${args.firstLogoTooltip}"

    second-logo-href="${args.secondLogoHref}"
    second-logo-src="${args.secondLogoSrc}"
    second-logo-alt="${args.secondLogoAlt}"
    second-logo-tooltip="${args.secondLogoTooltip}"

    third-logo-href="${args.thirdLogoHref}"
    third-logo-src="${args.thirdLogoSrc}"
    third-logo-alt="${args.thirdLogoAlt}"
    third-logo-tooltip="${args.thirdLogoTooltip}"

    location-button-href="${args.locationButtonHref}"
    location-button-text="${args.locationButtonText}"
    location-button-icon="${args.locationButtonIcon}"
    location-logo-src="${args.locationButtonSrc}"

    news-button-href="${args.newsButtonHref}"
    news-button-text="${args.newsButtonText}"
    news-button-icon="${args.newsButtonIcon}"
    news-logo-src="${args.newsButtonSrc}"

    ai-icon-href="${args.aiIconHref}"
    ai-icon-src="${args.aiIconSrc}"
    ai-icon-alt="${args.aiIconAlt}"
    ai-icon-tooltip="${args.aiIconTooltip}"

    chat-icon-href="${args.chatIconHref}"
    chat-icon-src="${args.chatIconSrc}"
    chat-icon-alt="${args.chatIconAlt}"
    chat-icon-tooltip="${args.chatIconTooltip}"

    hide-middle-section="${args.hideMiddleSection}"
  ></dda-sticky-footer>
`;
export const Default = Template.bind({});
Default.args = {
    happinessIconHref: '#',
    happinessIconSrc: happy_icon,
    happinessIconAlt: 'Happiness',
    happinessIconTooltip: 'Happiness',
    accessibilityIconHref: '#',
    accessibilityIconSrc: accessibility_icon,
    accessibilityIconAlt: 'Suggestions and complaints',
    accessibilityIconTooltip: 'Suggestions & complaints',
    servicesIconHref: '#',
    servicesIconSrc: grid_view,
    servicesIconAlt: 'Services',
    servicesIconTooltip: 'Services',
    servicesIconText: 'Services',
    firstLogoHref: '#',
    firstLogoSrc: digital_logo,
    firstLogoAlt: 'Logo 1',
    firstLogoTooltip: 'Logo 1',
    secondLogoHref: '#',
    secondLogoSrc: digital_logo,
    secondLogoAlt: 'Logo 1',
    secondLogoTooltip: 'Logo 1',
    thirdLogoHref: '#',
    thirdLogoSrc: digital_logo,
    thirdLogoAlt: 'Logo 3',
    thirdLogoTooltip: 'Logo 3',
    locationButtonHref: '#',
    locationButtonText: 'Location',
    locationButtonSrc: location_pin,
    locationButtonIcon: 'location_on',
    newsButtonHref: '#',
    newsButtonText: 'News',
    newsButtonSrc: news_pin,
    newsButtonIcon: 'news_on',
    aiIconHref: '#',
    aiIconSrc: digital_ai,
    aiIconAlt: 'Digital AI',
    aiIconTooltip: 'Digital AI',
    chatIconHref: '#',
    chatIconSrc: chat_icn,
    chatIconAlt: 'Online Chat',
    chatIconTooltip: 'Online Chat',
    hideMiddleSection: false,
};
//# sourceMappingURL=dda-sticky-footer.stories.js.map
