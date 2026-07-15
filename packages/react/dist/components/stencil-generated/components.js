'use client';
import { DdaAccordion as DdaAccordionElement, defineCustomElement as defineDdaAccordion } from "@dubai-design-system/components-js/dist/components/dda-accordion.js";
import { DdaAlert as DdaAlertElement, defineCustomElement as defineDdaAlert } from "@dubai-design-system/components-js/dist/components/dda-alert.js";
import { DdaAttachFile as DdaAttachFileElement, defineCustomElement as defineDdaAttachFile } from "@dubai-design-system/components-js/dist/components/dda-attach-file.js";
import { DdaAvatar as DdaAvatarElement, defineCustomElement as defineDdaAvatar } from "@dubai-design-system/components-js/dist/components/dda-avatar.js";
import { DdaBanner as DdaBannerElement, defineCustomElement as defineDdaBanner } from "@dubai-design-system/components-js/dist/components/dda-banner.js";
import { DdaBreadcrumb as DdaBreadcrumbElement, defineCustomElement as defineDdaBreadcrumb } from "@dubai-design-system/components-js/dist/components/dda-breadcrumb.js";
import { DdaButton as DdaButtonElement, defineCustomElement as defineDdaButton } from "@dubai-design-system/components-js/dist/components/dda-button.js";
import { DdaCheckbox as DdaCheckboxElement, defineCustomElement as defineDdaCheckbox } from "@dubai-design-system/components-js/dist/components/dda-checkbox.js";
import { DdaChip as DdaChipElement, defineCustomElement as defineDdaChip } from "@dubai-design-system/components-js/dist/components/dda-chip.js";
import { DdaCreditCard as DdaCreditCardElement, defineCustomElement as defineDdaCreditCard } from "@dubai-design-system/components-js/dist/components/dda-credit-card.js";
import { DdaCreditcardField as DdaCreditcardFieldElement, defineCustomElement as defineDdaCreditcardField } from "@dubai-design-system/components-js/dist/components/dda-creditcard-field.js";
import { DdaDropdown as DdaDropdownElement, defineCustomElement as defineDdaDropdown } from "@dubai-design-system/components-js/dist/components/dda-dropdown.js";
import { DdaFooter as DdaFooterElement, defineCustomElement as defineDdaFooter } from "@dubai-design-system/components-js/dist/components/dda-footer.js";
import { DdaHeader as DdaHeaderElement, defineCustomElement as defineDdaHeader } from "@dubai-design-system/components-js/dist/components/dda-header.js";
import { DdaHomeBanner as DdaHomeBannerElement, defineCustomElement as defineDdaHomeBanner } from "@dubai-design-system/components-js/dist/components/dda-home-banner.js";
import { DdaHorizontalStepper as DdaHorizontalStepperElement, defineCustomElement as defineDdaHorizontalStepper } from "@dubai-design-system/components-js/dist/components/dda-horizontal-stepper.js";
import { DdaInput as DdaInputElement, defineCustomElement as defineDdaInput } from "@dubai-design-system/components-js/dist/components/dda-input.js";
import { DdaLinkButton as DdaLinkButtonElement, defineCustomElement as defineDdaLinkButton } from "@dubai-design-system/components-js/dist/components/dda-link-button.js";
import { DdaNumberField as DdaNumberFieldElement, defineCustomElement as defineDdaNumberField } from "@dubai-design-system/components-js/dist/components/dda-number-field.js";
import { DdaPagination as DdaPaginationElement, defineCustomElement as defineDdaPagination } from "@dubai-design-system/components-js/dist/components/dda-pagination.js";
import { DdaPhonefield as DdaPhonefieldElement, defineCustomElement as defineDdaPhonefield } from "@dubai-design-system/components-js/dist/components/dda-phonefield.js";
import { DdaProgressbar as DdaProgressbarElement, defineCustomElement as defineDdaProgressbar } from "@dubai-design-system/components-js/dist/components/dda-progressbar.js";
import { DdaRadiobutton as DdaRadiobuttonElement, defineCustomElement as defineDdaRadiobutton } from "@dubai-design-system/components-js/dist/components/dda-radiobutton.js";
import { DdaRangeSlider as DdaRangeSliderElement, defineCustomElement as defineDdaRangeSlider } from "@dubai-design-system/components-js/dist/components/dda-range-slider.js";
import { DdaSearchInput as DdaSearchInputElement, defineCustomElement as defineDdaSearchInput } from "@dubai-design-system/components-js/dist/components/dda-search-input.js";
import { DdaSegmentedTabs as DdaSegmentedTabsElement, defineCustomElement as defineDdaSegmentedTabs } from "@dubai-design-system/components-js/dist/components/dda-segmented-tabs.js";
import { DdaSelect as DdaSelectElement, defineCustomElement as defineDdaSelect } from "@dubai-design-system/components-js/dist/components/dda-select.js";
import { DdaStickyFooter as DdaStickyFooterElement, defineCustomElement as defineDdaStickyFooter } from "@dubai-design-system/components-js/dist/components/dda-sticky-footer.js";
import { DdaTabs as DdaTabsElement, defineCustomElement as defineDdaTabs } from "@dubai-design-system/components-js/dist/components/dda-tabs.js";
import { DdaTextarea as DdaTextareaElement, defineCustomElement as defineDdaTextarea } from "@dubai-design-system/components-js/dist/components/dda-textarea.js";
import { DdaToggle as DdaToggleElement, defineCustomElement as defineDdaToggle } from "@dubai-design-system/components-js/dist/components/dda-toggle.js";
import { DdaTooltip as DdaTooltipElement, defineCustomElement as defineDdaTooltip } from "@dubai-design-system/components-js/dist/components/dda-tooltip.js";
import { DdaUiCard as DdaUiCardElement, defineCustomElement as defineDdaUiCard } from "@dubai-design-system/components-js/dist/components/dda-ui-card.js";
import { DdaVerticalStepper as DdaVerticalStepperElement, defineCustomElement as defineDdaVerticalStepper } from "@dubai-design-system/components-js/dist/components/dda-vertical-stepper.js";
import { createComponent } from '@stencil/react-output-target/runtime';
import React from 'react';
export const DdaAccordion = createComponent({
    tagName: 'dda-accordion',
    elementClass: DdaAccordionElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaAccordion
});
export const DdaAlert = createComponent({
    tagName: 'dda-alert',
    elementClass: DdaAlertElement,
    react: React,
    events: {
        onFirstClick: 'firstClick',
        onSecondClick: 'secondClick'
    },
    defineCustomElement: defineDdaAlert
});
export const DdaAttachFile = createComponent({
    tagName: 'dda-attach-file',
    elementClass: DdaAttachFileElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaAttachFile
});
export const DdaAvatar = createComponent({
    tagName: 'dda-avatar',
    elementClass: DdaAvatarElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaAvatar
});
export const DdaBanner = createComponent({
    tagName: 'dda-banner',
    elementClass: DdaBannerElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaBanner
});
export const DdaBreadcrumb = createComponent({
    tagName: 'dda-breadcrumb',
    elementClass: DdaBreadcrumbElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaBreadcrumb
});
export const DdaButton = createComponent({
    tagName: 'dda-button',
    elementClass: DdaButtonElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaButton
});
export const DdaCheckbox = createComponent({
    tagName: 'dda-checkbox',
    elementClass: DdaCheckboxElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaCheckbox
});
export const DdaChip = createComponent({
    tagName: 'dda-chip',
    elementClass: DdaChipElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaChip
});
export const DdaCreditCard = createComponent({
    tagName: 'dda-credit-card',
    elementClass: DdaCreditCardElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaCreditCard
});
export const DdaCreditcardField = createComponent({
    tagName: 'dda-creditcard-field',
    elementClass: DdaCreditcardFieldElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaCreditcardField
});
export const DdaDropdown = createComponent({
    tagName: 'dda-dropdown',
    elementClass: DdaDropdownElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaDropdown
});
export const DdaFooter = createComponent({
    tagName: 'dda-footer',
    elementClass: DdaFooterElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaFooter
});
export const DdaHeader = createComponent({
    tagName: 'dda-header',
    elementClass: DdaHeaderElement,
    react: React,
    events: {
        onLanguageSwitch: 'languageSwitch',
        onSmTextSize: 'smTextSize',
        onBaseTextSize: 'baseTextSize',
        onLgTextSize: 'lgTextSize',
        onNormalContrast: 'normalContrast',
        onBlindContrast: 'blindContrast',
        onRedContrast: 'redContrast',
        onGreenContrast: 'greenContrast'
    },
    defineCustomElement: defineDdaHeader
});
export const DdaHomeBanner = createComponent({
    tagName: 'dda-home-banner',
    elementClass: DdaHomeBannerElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaHomeBanner
});
export const DdaHorizontalStepper = createComponent({
    tagName: 'dda-horizontal-stepper',
    elementClass: DdaHorizontalStepperElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaHorizontalStepper
});
export const DdaInput = createComponent({
    tagName: 'dda-input',
    elementClass: DdaInputElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaInput
});
export const DdaLinkButton = createComponent({
    tagName: 'dda-link-button',
    elementClass: DdaLinkButtonElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaLinkButton
});
export const DdaNumberField = createComponent({
    tagName: 'dda-number-field',
    elementClass: DdaNumberFieldElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaNumberField
});
export const DdaPagination = createComponent({
    tagName: 'dda-pagination',
    elementClass: DdaPaginationElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaPagination
});
export const DdaPhonefield = createComponent({
    tagName: 'dda-phonefield',
    elementClass: DdaPhonefieldElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaPhonefield
});
export const DdaProgressbar = createComponent({
    tagName: 'dda-progressbar',
    elementClass: DdaProgressbarElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaProgressbar
});
export const DdaRadiobutton = createComponent({
    tagName: 'dda-radiobutton',
    elementClass: DdaRadiobuttonElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaRadiobutton
});
export const DdaRangeSlider = createComponent({
    tagName: 'dda-range-slider',
    elementClass: DdaRangeSliderElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaRangeSlider
});
export const DdaSearchInput = createComponent({
    tagName: 'dda-search-input',
    elementClass: DdaSearchInputElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaSearchInput
});
export const DdaSegmentedTabs = createComponent({
    tagName: 'dda-segmented-tabs',
    elementClass: DdaSegmentedTabsElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaSegmentedTabs
});
export const DdaSelect = createComponent({
    tagName: 'dda-select',
    elementClass: DdaSelectElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaSelect
});
export const DdaStickyFooter = createComponent({
    tagName: 'dda-sticky-footer',
    elementClass: DdaStickyFooterElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaStickyFooter
});
export const DdaTabs = createComponent({
    tagName: 'dda-tabs',
    elementClass: DdaTabsElement,
    react: React,
    events: { onTabClick: 'tabClick' },
    defineCustomElement: defineDdaTabs
});
export const DdaTextarea = createComponent({
    tagName: 'dda-textarea',
    elementClass: DdaTextareaElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaTextarea
});
export const DdaToggle = createComponent({
    tagName: 'dda-toggle',
    elementClass: DdaToggleElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaToggle
});
export const DdaTooltip = createComponent({
    tagName: 'dda-tooltip',
    elementClass: DdaTooltipElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaTooltip
});
export const DdaUiCard = createComponent({
    tagName: 'dda-ui-card',
    elementClass: DdaUiCardElement,
    react: React,
    events: { onLinkClick: 'linkClick' },
    defineCustomElement: defineDdaUiCard
});
export const DdaVerticalStepper = createComponent({
    tagName: 'dda-vertical-stepper',
    elementClass: DdaVerticalStepperElement,
    react: React,
    events: {},
    defineCustomElement: defineDdaVerticalStepper
});
//# sourceMappingURL=components.js.map