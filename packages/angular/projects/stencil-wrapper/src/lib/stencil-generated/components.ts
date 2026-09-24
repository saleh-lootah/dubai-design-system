/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@dubai-design-system/components-js';


@ProxyCmp({
  inputs: ['accordion_icon', 'body_description', 'component_mode', 'custom_class', 'design', 'header_text']
})
@Component({
  selector: 'dda-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['accordion_icon', 'body_description', 'component_mode', 'custom_class', 'design', 'header_text'],
})
export class DdaAccordion {
  protected el: HTMLDdaAccordionElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaAccordion extends Components.DdaAccordion {}


@ProxyCmp({
  inputs: ['button_name', 'button_text', 'clickHandler', 'close_button_label', 'component_id', 'component_mode', 'custom_class', 'description', 'first_button', 'first_link', 'heading_level', 'second_button', 'second_link', 'title_text', 'type', 'variation']
})
@Component({
  selector: 'dda-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['button_name', 'button_text', 'clickHandler', 'close_button_label', 'component_id', 'component_mode', 'custom_class', 'description', 'first_button', 'first_link', 'heading_level', 'second_button', 'second_link', 'title_text', 'type', 'variation'],
})
export class DdaAlert {
  protected el: HTMLDdaAlertElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['firstClick', 'secondClick']);
  }
}


export declare interface DdaAlert extends Components.DdaAlert {
  /**
   * Fires when the first action link is clicked. No detail.
   */
  firstClick: EventEmitter<CustomEvent<void>>;
  /**
   * Fires when the second action link is clicked. No detail.
   */
  secondClick: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  inputs: ['aria_label', 'button_aria_label', 'button_id', 'button_name', 'component_mode', 'custom_class', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_type', 'label', 'size', 'validation_type']
})
@Component({
  selector: 'dda-attach-file',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'button_aria_label', 'button_id', 'button_name', 'component_mode', 'custom_class', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_type', 'label', 'size', 'validation_type'],
})
export class DdaAttachFile {
  protected el: HTMLDdaAttachFileElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaAttachFile extends Components.DdaAttachFile {}


@ProxyCmp({
  inputs: ['aria_label', 'button_id', 'button_name', 'component_mode', 'custom_class', 'design', 'icon', 'notification_number', 'options', 'rounded', 'selected', 'size', 'src', 'text', 'type']
})
@Component({
  selector: 'dda-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'button_id', 'button_name', 'component_mode', 'custom_class', 'design', 'icon', 'notification_number', 'options', 'rounded', 'selected', 'size', 'src', 'text', 'type'],
})
export class DdaAvatar {
  protected el: HTMLDdaAvatarElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['optionSelect']);
  }
}


export declare interface DdaAvatar extends Components.DdaAvatar {
  /**
   * Emitted every time the user picks an option from the dropdown, also when it is already selected. `detail.value` is the option.
   */
  optionSelect: EventEmitter<CustomEvent<{ value: string }>>;
}


@ProxyCmp({
  inputs: ['aria_label', 'slider_height', 'slider_width', 'slides']
})
@Component({
  selector: 'dda-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'slider_height', 'slider_width', 'slides'],
})
export class DdaBanner {
  protected el: HTMLDdaBannerElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaBanner extends Components.DdaBanner {}


@ProxyCmp({
  inputs: ['breadcrumbs', 'component_mode', 'custom_class', 'design', 'separator']
})
@Component({
  selector: 'dda-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['breadcrumbs', 'component_mode', 'custom_class', 'design', 'separator'],
})
export class DdaBreadcrumb {
  protected el: HTMLDdaBreadcrumbElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaBreadcrumb extends Components.DdaBreadcrumb {}


@ProxyCmp({
  inputs: ['aria_label', 'button_color', 'button_id', 'button_name', 'button_shape', 'clickHandler', 'component_mode', 'custom_class', 'disabled', 'end_icon', 'gap', 'icon_button_shape', 'size', 'start_icon', 'type']
})
@Component({
  selector: 'dda-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'button_color', 'button_id', 'button_name', 'button_shape', 'clickHandler', 'component_mode', 'custom_class', 'disabled', 'end_icon', 'gap', 'icon_button_shape', 'size', 'start_icon', 'type'],
})
export class DdaButton {
  protected el: HTMLDdaButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaButton extends Components.DdaButton {}


@ProxyCmp({
  inputs: ['aria_label', 'checkbox_status', 'checked', 'component_mode', 'custom_class', 'group_name', 'input_id', 'size', 'style_type', 'supporting', 'title_text']
})
@Component({
  selector: 'dda-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'checkbox_status', 'checked', 'component_mode', 'custom_class', 'group_name', 'input_id', 'size', 'style_type', 'supporting', 'title_text'],
})
export class DdaCheckbox {
  protected el: HTMLDdaCheckboxElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaCheckbox extends Components.DdaCheckbox {}


@ProxyCmp({
  inputs: ['bg_color', 'clickHandler', 'close_button_label', 'component_mode', 'custom_class', 'icon', 'rounded', 'show_close_icon', 'size']
})
@Component({
  selector: 'dda-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['bg_color', 'clickHandler', 'close_button_label', 'component_mode', 'custom_class', 'icon', 'rounded', 'show_close_icon', 'size'],
})
export class DdaChip {
  protected el: HTMLDdaChipElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaChip extends Components.DdaChip {}


@ProxyCmp({
  inputs: ['balance', 'card_number', 'card_type', 'component_mode', 'custom_class', 'design', 'name']
})
@Component({
  selector: 'dda-credit-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['balance', 'card_number', 'card_type', 'component_mode', 'custom_class', 'design', 'name'],
})
export class DdaCreditCard {
  protected el: HTMLDdaCreditCardElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaCreditCard extends Components.DdaCreditCard {}


@ProxyCmp({
  inputs: ['aria_label', 'autocomplete', 'card_icon', 'component_mode', 'custom_class', 'disabled', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_type', 'label', 'placeholder', 'restrict_input', 'size', 'validation_type', 'value']
})
@Component({
  selector: 'dda-creditcard-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'autocomplete', 'card_icon', 'component_mode', 'custom_class', 'disabled', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_type', 'label', 'placeholder', 'restrict_input', 'size', 'validation_type', 'value'],
})
export class DdaCreditcardField {
  protected el: HTMLDdaCreditcardFieldElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['valueChange']);
  }
}


export declare interface DdaCreditcardField extends Components.DdaCreditcardField {
  /**
   * Emitted when user input changes `value`, after the component removes characters other than digits and `-`. `detail.value` is the new `value`.
   */
  valueChange: EventEmitter<CustomEvent<{ value: string }>>;
}


@ProxyCmp({
  inputs: ['aria_label', 'arrow_button_name', 'button_id', 'component_mode', 'custom_class', 'disabled', 'dropdown_button_name', 'error', 'helper_text', 'icon_mode', 'label', 'options', 'selected', 'size', 'toggle_button_label', 'type']
})
@Component({
  selector: 'dda-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'arrow_button_name', 'button_id', 'component_mode', 'custom_class', 'disabled', 'dropdown_button_name', 'error', 'helper_text', 'icon_mode', 'label', 'options', 'selected', 'size', 'toggle_button_label', 'type'],
})
export class DdaDropdown {
  protected el: HTMLDdaDropdownElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['optionSelect']);
  }
}


export declare interface DdaDropdown extends Components.DdaDropdown {
  /**
   * Emitted every time the user picks an option, also when it is already selected, so the dropdown works as an action menu. `detail.value` is the option.
   */
  optionSelect: EventEmitter<CustomEvent<{ value: string }>>;
}


@ProxyCmp({
  inputs: ['copyrightText', 'description', 'footerSections', 'footerTitle', 'heading_level', 'loginButtonText', 'logoAlt', 'logoDescription', 'logoSrc', 'signUpButtonText', 'socialIcons']
})
@Component({
  selector: 'dda-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['copyrightText', 'description', 'footerSections', 'footerTitle', 'heading_level', 'loginButtonText', 'logoAlt', 'logoDescription', 'logoSrc', 'signUpButtonText', 'socialIcons'],
})
export class DdaFooter {
  protected el: HTMLDdaFooterElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaFooter extends Components.DdaFooter {}


@ProxyCmp({
  inputs: ['accessibility_button_icon_family', 'accessibility_button_icon_name', 'accessibility_button_id', 'accessibility_button_name', 'accessibility_button_text', 'accessibility_tooltip', 'close_accessibility_button_name', 'close_menu_button_name', 'close_sidebar_button_name', 'contrast_color_blind_text', 'contrast_description', 'contrast_green_weakness_text', 'contrast_noraml_text', 'contrast_normal_text', 'contrast_red_weakness_text', 'contrast_title', 'firstLogoAlt', 'firstLogoHref', 'firstLogoSrc', 'firstLogoWhiteSrc', 'hamburger_menu_button_name', 'hideOtherMenu', 'hide_login', 'language_button_name', 'language_lang', 'language_text', 'language_tooltip', 'loginIcon', 'loginLink', 'loginText', 'login_tooltip', 'menu_button_label', 'mobileMenuSearchId', 'mobileMenuSearchUrl', 'otherMenuItems', 'quickLinks', 'readSpeakerLink', 'read_speaker_link', 'screen_reader_description', 'screen_reader_link_label', 'screen_reader_title', 'searchText', 'search_action', 'search_button_name', 'search_input_name', 'search_input_placeholder', 'search_tooltip', 'secondLogoAlt', 'secondLogoHref', 'secondLogoSrc', 'secondLogoWhiteSrc', 'selected_contrast', 'selected_text_size', 'sideMainMenuTitle', 'sideMenuItems', 'sideOtherMenuTitle', 'text_size_description', 'text_size_title', 'toggle_accessibility_button_name', 'usePredesignedAccessibilityMenu']
})
@Component({
  selector: 'dda-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['accessibility_button_icon_family', 'accessibility_button_icon_name', 'accessibility_button_id', 'accessibility_button_name', 'accessibility_button_text', 'accessibility_tooltip', 'close_accessibility_button_name', 'close_menu_button_name', 'close_sidebar_button_name', 'contrast_color_blind_text', 'contrast_description', 'contrast_green_weakness_text', 'contrast_noraml_text', 'contrast_normal_text', 'contrast_red_weakness_text', 'contrast_title', 'firstLogoAlt', 'firstLogoHref', 'firstLogoSrc', 'firstLogoWhiteSrc', 'hamburger_menu_button_name', 'hideOtherMenu', 'hide_login', 'language_button_name', 'language_lang', 'language_text', 'language_tooltip', 'loginIcon', 'loginLink', 'loginText', 'login_tooltip', 'menu_button_label', 'mobileMenuSearchId', 'mobileMenuSearchUrl', 'otherMenuItems', 'quickLinks', 'readSpeakerLink', 'read_speaker_link', 'screen_reader_description', 'screen_reader_link_label', 'screen_reader_title', 'searchText', 'search_action', 'search_button_name', 'search_input_name', 'search_input_placeholder', 'search_tooltip', 'secondLogoAlt', 'secondLogoHref', 'secondLogoSrc', 'secondLogoWhiteSrc', 'selected_contrast', 'selected_text_size', 'sideMainMenuTitle', 'sideMenuItems', 'sideOtherMenuTitle', 'text_size_description', 'text_size_title', 'toggle_accessibility_button_name', 'usePredesignedAccessibilityMenu'],
})
export class DdaHeader {
  protected el: HTMLDdaHeaderElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['accessibilitymenufunctionality', 'searchfunctionality', 'languageSwitch', 'smTextSize', 'baseTextSize', 'lgTextSize', 'normalContrast', 'blindContrast', 'redContrast', 'greenContrast', 'searchSubmit']);
  }
}


export declare interface DdaHeader extends Components.DdaHeader {
  /**
   * Emitted on every click of an accessibility button (3.x name).
   */
  accessibilitymenufunctionality: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted with the query when a non-empty search is submitted (3.x name). Pages that open a results page from this event keep working. `searchSubmit` is the 5.x event, and it can cancel the navigation.
   */
  searchfunctionality: EventEmitter<CustomEvent<string>>;
  /**
   * Emitted when the user clicks the language button.
   */
  languageSwitch: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the user clicks the `A-` (smaller text) button in the accessibility panel.
   */
  smTextSize: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the user clicks the `A` (default text size) button in the accessibility panel.
   */
  baseTextSize: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the user clicks the `A+` (larger text) button in the accessibility panel.
   */
  lgTextSize: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the user selects the Normal contrast option.
   */
  normalContrast: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the user selects the Colours Blind contrast option.
   */
  blindContrast: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the user selects the Red Weakness contrast option.
   */
  redContrast: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the user selects the Green Weakness contrast option.
   */
  greenContrast: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when a non-empty search is submitted. Call `preventDefault()` to stop the
browser navigating to `search_action`, for example to route inside a single-page app.
   */
  searchSubmit: EventEmitter<CustomEvent<{ query: string }>>;
}


@ProxyCmp({
  inputs: ['aria_label', 'autoplay', 'interval', 'next_button_label', 'pause_button_label', 'play_button_label', 'previous_button_label', 'slide_button_label', 'slide_status_label']
})
@Component({
  selector: 'dda-home-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'autoplay', 'interval', 'next_button_label', 'pause_button_label', 'play_button_label', 'previous_button_label', 'slide_button_label', 'slide_status_label'],
})
export class DdaHomeBanner {
  protected el: HTMLDdaHomeBannerElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaHomeBanner extends Components.DdaHomeBanner {}


@ProxyCmp({
  inputs: ['component_mode', 'current_step', 'custom_class', 'steps']
})
@Component({
  selector: 'dda-horizontal-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['component_mode', 'current_step', 'custom_class', 'steps'],
})
export class DdaHorizontalStepper {
  protected el: HTMLDdaHorizontalStepperElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaHorizontalStepper extends Components.DdaHorizontalStepper {}


@ProxyCmp({
  inputs: ['aria_label', 'autocomplete', 'component_mode', 'custom_class', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_status', 'label', 'placeholder', 'size', 'type', 'validation_type', 'value']
})
@Component({
  selector: 'dda-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'autocomplete', 'component_mode', 'custom_class', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_status', 'label', 'placeholder', 'size', 'type', 'validation_type', 'value'],
})
export class DdaInput {
  protected el: HTMLDdaInputElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaInput extends Components.DdaInput {}


@ProxyCmp({
  inputs: ['aria_label', 'button_color', 'button_id', 'button_shape', 'component_mode', 'custom_class', 'disabled', 'end_icon', 'gap', 'href', 'icon_button_shape', 'size', 'start_icon', 'type']
})
@Component({
  selector: 'dda-link-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'button_color', 'button_id', 'button_shape', 'component_mode', 'custom_class', 'disabled', 'end_icon', 'gap', 'href', 'icon_button_shape', 'size', 'start_icon', 'type'],
})
export class DdaLinkButton {
  protected el: HTMLDdaLinkButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaLinkButton extends Components.DdaLinkButton {}


@ProxyCmp({
  inputs: ['aria_label', 'component_mode', 'currencies', 'currency_button_name', 'custom_class', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_status', 'label', 'placeholder', 'selected_currency', 'size', 'toggle_button_label', 'toggle_button_name', 'validation_type', 'value']
})
@Component({
  selector: 'dda-number-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'component_mode', 'currencies', 'currency_button_name', 'custom_class', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_status', 'label', 'placeholder', 'selected_currency', 'size', 'toggle_button_label', 'toggle_button_name', 'validation_type', 'value'],
})
export class DdaNumberField {
  protected el: HTMLDdaNumberFieldElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaNumberField extends Components.DdaNumberField {}


@ProxyCmp({
  inputs: ['button_text_next_button', 'button_text_prev_button', 'buttons_next_button', 'buttons_pages_next_button', 'buttons_pages_prev_button', 'buttons_prev_button', 'component_mode', 'current_page', 'custom_class', 'next_button_label', 'previous_button_label', 'simple_slider_next_button', 'simple_slider_prev_button', 'text_next_button', 'text_pages_next_button', 'text_pages_prev_button', 'text_prev_button', 'total_pages', 'type']
})
@Component({
  selector: 'dda-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['button_text_next_button', 'button_text_prev_button', 'buttons_next_button', 'buttons_pages_next_button', 'buttons_pages_prev_button', 'buttons_prev_button', 'component_mode', 'current_page', 'custom_class', 'next_button_label', 'previous_button_label', 'simple_slider_next_button', 'simple_slider_prev_button', 'text_next_button', 'text_pages_next_button', 'text_pages_prev_button', 'text_prev_button', 'total_pages', 'type'],
})
export class DdaPagination {
  protected el: HTMLDdaPaginationElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['pageChange']);
  }
}


export declare interface DdaPagination extends Components.DdaPagination {
  /**
   * Emitted when the user moves to a different page. `detail.page` is the new page, counted from 1.
   */
  pageChange: EventEmitter<CustomEvent<{ page: number }>>;
}


@ProxyCmp({
  inputs: ['aria_label', 'autocomplete', 'button_aria_label', 'button_id', 'component_mode', 'country_select_button_name', 'custom_class', 'disabled', 'error_message', 'helper_text', 'input_id', 'label', 'phone_input_name', 'placeholder', 'size', 'toggle_button_label', 'toggle_button_name', 'validation_type']
})
@Component({
  selector: 'dda-phonefield',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'autocomplete', 'button_aria_label', 'button_id', 'component_mode', 'country_select_button_name', 'custom_class', 'disabled', 'error_message', 'helper_text', 'input_id', 'label', 'phone_input_name', 'placeholder', 'size', 'toggle_button_label', 'toggle_button_name', 'validation_type'],
})
export class DdaPhonefield {
  protected el: HTMLDdaPhonefieldElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaPhonefield extends Components.DdaPhonefield {}


@ProxyCmp({
  inputs: ['aria_label', 'component_mode', 'custom_class', 'progress', 'show_percentage_text', 'tooltip', 'tooltip_position']
})
@Component({
  selector: 'dda-progressbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'component_mode', 'custom_class', 'progress', 'show_percentage_text', 'tooltip', 'tooltip_position'],
})
export class DdaProgressbar {
  protected el: HTMLDdaProgressbarElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaProgressbar extends Components.DdaProgressbar {}


@ProxyCmp({
  inputs: ['aria_label', 'checked', 'component_mode', 'custom_class', 'group_name', 'input_id', 'radio_status', 'size', 'supporting', 'title_text', 'variants']
})
@Component({
  selector: 'dda-radiobutton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'checked', 'component_mode', 'custom_class', 'group_name', 'input_id', 'radio_status', 'size', 'supporting', 'title_text', 'variants'],
})
export class DdaRadiobutton {
  protected el: HTMLDdaRadiobuttonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaRadiobutton extends Components.DdaRadiobutton {}


@ProxyCmp({
  inputs: ['component_mode', 'custom_class', 'initial_max', 'initial_min', 'left_aria_label', 'left_input_id', 'left_input_name', 'max', 'min', 'right_aria_label', 'right_input_id', 'right_input_name', 'size', 'step', 'tooltip_position']
})
@Component({
  selector: 'dda-range-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['component_mode', 'custom_class', 'initial_max', 'initial_min', 'left_aria_label', 'left_input_id', 'left_input_name', 'max', 'min', 'right_aria_label', 'right_input_id', 'right_input_name', 'size', 'step', 'tooltip_position'],
})
export class DdaRangeSlider {
  protected el: HTMLDdaRangeSliderElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaRangeSlider extends Components.DdaRangeSlider {}


@ProxyCmp({
  inputs: ['aria_label', 'button_aria_label', 'button_id', 'clear_button_label', 'close_button_name', 'component_mode', 'custom_class', 'error_message', 'has_error', 'helper_text', 'input_id', 'input_status', 'label', 'placeholder', 'search_button_name', 'search_input_name', 'show_button', 'size']
})
@Component({
  selector: 'dda-search-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'button_aria_label', 'button_id', 'clear_button_label', 'close_button_name', 'component_mode', 'custom_class', 'error_message', 'has_error', 'helper_text', 'input_id', 'input_status', 'label', 'placeholder', 'search_button_name', 'search_input_name', 'show_button', 'size'],
})
export class DdaSearchInput {
  protected el: HTMLDdaSearchInputElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaSearchInput extends Components.DdaSearchInput {}


@ProxyCmp({
  inputs: ['aria_label', 'button_name', 'component_mode', 'custom_class', 'icon_labels', 'items', 'radius_type', 'selected_index']
})
@Component({
  selector: 'dda-segmented-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'button_name', 'component_mode', 'custom_class', 'icon_labels', 'items', 'radius_type', 'selected_index'],
})
export class DdaSegmentedTabs {
  protected el: HTMLDdaSegmentedTabsElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['segmentChange']);
  }
}


export declare interface DdaSegmentedTabs extends Components.DdaSegmentedTabs {
  /**
   * Fires when the user selects a different segment. `detail` is the new index, from 0.
   */
  segmentChange: EventEmitter<CustomEvent<number>>;
}


@ProxyCmp({
  inputs: ['aria_label', 'button_id', 'component_mode', 'custom_class', 'disabled', 'error', 'error_message', 'helper_text', 'label', 'option_select_button_name', 'options', 'selected', 'size', 'toggle_button_name']
})
@Component({
  selector: 'dda-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'button_id', 'component_mode', 'custom_class', 'disabled', 'error', 'error_message', 'helper_text', 'label', 'option_select_button_name', 'options', 'selected', 'size', 'toggle_button_name'],
})
export class DdaSelect {
  protected el: HTMLDdaSelectElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['selectionChange']);
  }
}


export declare interface DdaSelect extends Components.DdaSelect {
  /**
   * Emitted when the user picks an option other than the selected one, by mouse or keyboard. `detail.value` is the new option.
   */
  selectionChange: EventEmitter<CustomEvent<{ value: string }>>;
}


@ProxyCmp({
  inputs: ['accessibilityIconAlt', 'accessibilityIconHref', 'accessibilityIconId', 'accessibilityIconSrc', 'accessibilityIconSrcDark', 'accessibilityIconTooltip', 'aiIconAlt', 'aiIconHref', 'aiIconId', 'aiIconSrc', 'aiIconSrcDark', 'aiIconTooltip', 'aria_label', 'chatIconAlt', 'chatIconHref', 'chatIconId', 'chatIconSrc', 'chatIconSrcDark', 'chatIconTooltip', 'colorTheme', 'firstLogoAlt', 'firstLogoHref', 'firstLogoSrc', 'firstLogoTooltip', 'happinessIconAlt', 'happinessIconHref', 'happinessIconId', 'happinessIconSrc', 'happinessIconSrcDark', 'happinessIconTooltip', 'hideMiddleSection', 'locationButtonHref', 'locationButtonIcon', 'locationButtonText', 'locationLogoSrc', 'middleLink', 'newsButtonHref', 'newsButtonIcon', 'newsButtonSrc', 'newsButtonText', 'rightLink', 'secondLogoAlt', 'secondLogoHref', 'secondLogoSrc', 'secondLogoTooltip', 'servicesIconAlt', 'servicesIconHref', 'servicesIconId', 'servicesIconSrc', 'servicesIconSrcDark', 'servicesIconText', 'servicesIconTooltip', 'thirdLogoAlt', 'thirdLogoHref', 'thirdLogoSrc', 'thirdLogoTooltip']
})
@Component({
  selector: 'dda-sticky-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['accessibilityIconAlt', 'accessibilityIconHref', 'accessibilityIconId', 'accessibilityIconSrc', 'accessibilityIconSrcDark', 'accessibilityIconTooltip', 'aiIconAlt', 'aiIconHref', 'aiIconId', 'aiIconSrc', 'aiIconSrcDark', 'aiIconTooltip', 'aria_label', 'chatIconAlt', 'chatIconHref', 'chatIconId', 'chatIconSrc', 'chatIconSrcDark', 'chatIconTooltip', 'colorTheme', 'firstLogoAlt', 'firstLogoHref', 'firstLogoSrc', 'firstLogoTooltip', 'happinessIconAlt', 'happinessIconHref', 'happinessIconId', 'happinessIconSrc', 'happinessIconSrcDark', 'happinessIconTooltip', 'hideMiddleSection', 'locationButtonHref', 'locationButtonIcon', 'locationButtonText', 'locationLogoSrc', 'middleLink', 'newsButtonHref', 'newsButtonIcon', 'newsButtonSrc', 'newsButtonText', 'rightLink', 'secondLogoAlt', 'secondLogoHref', 'secondLogoSrc', 'secondLogoTooltip', 'servicesIconAlt', 'servicesIconHref', 'servicesIconId', 'servicesIconSrc', 'servicesIconSrcDark', 'servicesIconText', 'servicesIconTooltip', 'thirdLogoAlt', 'thirdLogoHref', 'thirdLogoSrc', 'thirdLogoTooltip'],
})
export class DdaStickyFooter {
  protected el: HTMLDdaStickyFooterElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaStickyFooter extends Components.DdaStickyFooter {}


@ProxyCmp({
  inputs: ['aria_label', 'border_bottom', 'button_id', 'button_name', 'component_mode', 'custom_class', 'hover_style', 'tab_icons', 'tab_texts', 'type']
})
@Component({
  selector: 'dda-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'border_bottom', 'button_id', 'button_name', 'component_mode', 'custom_class', 'hover_style', 'tab_icons', 'tab_texts', 'type'],
})
export class DdaTabs {
  protected el: HTMLDdaTabsElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['tabClick']);
  }
}


export declare interface DdaTabs extends Components.DdaTabs {
  /**
   * Fires when the user clicks a tab. `detail` is the tab index, a number from 0.
   */
  tabClick: EventEmitter<CustomEvent<number>>;
}


@ProxyCmp({
  inputs: ['aria_label', 'component_mode', 'custom_class', 'enable_rich_editor', 'error_message', 'helper_text', 'input_id', 'input_status', 'label', 'max_characters', 'placeholder', 'textarea_name', 'validation_type', 'value']
})
@Component({
  selector: 'dda-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'component_mode', 'custom_class', 'enable_rich_editor', 'error_message', 'helper_text', 'input_id', 'input_status', 'label', 'max_characters', 'placeholder', 'textarea_name', 'validation_type', 'value'],
})
export class DdaTextarea {
  protected el: HTMLDdaTextareaElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaTextarea extends Components.DdaTextarea {}


@ProxyCmp({
  inputs: ['aria_label', 'checked', 'component_mode', 'custom_class', 'group_name', 'input_id', 'size', 'supporting', 'title_text']
})
@Component({
  selector: 'dda-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'checked', 'component_mode', 'custom_class', 'group_name', 'input_id', 'size', 'supporting', 'title_text'],
})
export class DdaToggle {
  protected el: HTMLDdaToggleElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaToggle extends Components.DdaToggle {}


@ProxyCmp({
  inputs: ['component_mode', 'custom_class', 'description', 'position', 'title_text']
})
@Component({
  selector: 'dda-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['component_mode', 'custom_class', 'description', 'position', 'title_text'],
})
export class DdaTooltip {
  protected el: HTMLDdaTooltipElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaTooltip extends Components.DdaTooltip {}


@ProxyCmp({
  inputs: ['heading_level', 'icon', 'image', 'link', 'linkicon', 'linktext', 'maintitle', 'subtitle', 'type']
})
@Component({
  selector: 'dda-ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['heading_level', 'icon', 'image', 'link', 'linkicon', 'linktext', 'maintitle', 'subtitle', 'type'],
})
export class DdaUiCard {
  protected el: HTMLDdaUiCardElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['linkClick']);
  }
}


export declare interface DdaUiCard extends Components.DdaUiCard {
  /**
   * Emitted when the user clicks the card link. `detail` is the original click `MouseEvent`; call `detail.preventDefault()` to stop the navigation.
   */
  linkClick: EventEmitter<CustomEvent<MouseEvent>>;
}


@ProxyCmp({
  inputs: ['component_mode', 'current_Step', 'current_step', 'custom_class', 'steps']
})
@Component({
  selector: 'dda-vertical-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['component_mode', 'current_Step', 'current_step', 'custom_class', 'steps'],
})
export class DdaVerticalStepper {
  protected el: HTMLDdaVerticalStepperElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaVerticalStepper extends Components.DdaVerticalStepper {}


