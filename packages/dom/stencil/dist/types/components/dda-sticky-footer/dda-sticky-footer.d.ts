export declare class DdaStickyFooter {
    /** Left Section Props */
    happinessIconHref: string;
    happinessIconSrc: string;
    happinessIconAlt: string;
    happinessIconTooltip: string;
    accessibilityIconHref: string;
    accessibilityIconSrc: string;
    accessibilityIconAlt: string;
    accessibilityIconTooltip: string;
    servicesIconHref: string;
    servicesIconSrc: string;
    servicesIconAlt: string;
    servicesIconTooltip: string;
    servicesIconText: string;
    /** Middle Section Props */
    firstLogoHref: string;
    firstLogoSrc: string;
    firstLogoAlt: string;
    firstLogoTooltip: string;
    secondLogoHref: string;
    secondLogoSrc: string;
    secondLogoAlt: string;
    secondLogoTooltip: string;
    thirdLogoHref: string;
    thirdLogoSrc: string;
    thirdLogoAlt: string;
    thirdLogoTooltip: string;
    /** Right Section Props */
    locationButtonHref: string;
    locationLogoSrc: string;
    locationButtonText: string;
    locationButtonIcon: string;
    newsButtonHref: string;
    newsButtonSrc: string;
    newsButtonText: string;
    newsButtonIcon: string;
    aiIconHref: string;
    aiIconSrc: string;
    aiIconAlt: string;
    aiIconTooltip: string;
    chatIconHref: string;
    chatIconSrc: string;
    chatIconAlt: string;
    chatIconTooltip: string;
    isHidden: boolean;
    private lastScrollY;
    hideMiddleSection: boolean;
    componentWillLoad(): void;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    handleScroll(): void;
    render(): any;
}
