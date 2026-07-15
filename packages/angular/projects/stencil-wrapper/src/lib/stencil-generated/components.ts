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
  inputs: ['button_name', 'button_text', 'clickHandler', 'component_id', 'component_mode', 'custom_class', 'description', 'first_button', 'first_link', 'second_button', 'second_link', 'title_text', 'type', 'variation']
})
@Component({
  selector: 'dda-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['button_name', 'button_text', 'clickHandler', 'component_id', 'component_mode', 'custom_class', 'description', 'first_button', 'first_link', 'second_button', 'second_link', 'title_text', 'type', 'variation'],
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

  firstClick: EventEmitter<CustomEvent<void>>;

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
  }
}


export declare interface DdaAvatar extends Components.DdaAvatar {}


@ProxyCmp({
  inputs: ['slider_height', 'slider_width', 'slides']
})
@Component({
  selector: 'dda-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['slider_height', 'slider_width', 'slides'],
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
  inputs: ['component_mode', 'custom_class', 'design', 'separator']
})
@Component({
  selector: 'dda-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['component_mode', 'custom_class', 'design', 'separator'],
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
  inputs: ['bg_color', 'clickHandler', 'component_mode', 'custom_class', 'icon', 'rounded', 'show_close_icon', 'size']
})
@Component({
  selector: 'dda-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['bg_color', 'clickHandler', 'component_mode', 'custom_class', 'icon', 'rounded', 'show_close_icon', 'size'],
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
  inputs: ['aria_label', 'card_icon', 'component_mode', 'custom_class', 'disabled', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_type', 'label', 'placeholder', 'restrict_input', 'size', 'validation_type', 'value']
})
@Component({
  selector: 'dda-creditcard-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'card_icon', 'component_mode', 'custom_class', 'disabled', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_type', 'label', 'placeholder', 'restrict_input', 'size', 'validation_type', 'value'],
})
export class DdaCreditcardField {
  protected el: HTMLDdaCreditcardFieldElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaCreditcardField extends Components.DdaCreditcardField {}


@ProxyCmp({
  inputs: ['aria_label', 'arrow_button_name', 'button_id', 'component_mode', 'custom_class', 'disabled', 'dropdown_button_name', 'error', 'helper_text', 'icon_mode', 'label', 'options', 'selected', 'size', 'type']
})
@Component({
  selector: 'dda-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'arrow_button_name', 'button_id', 'component_mode', 'custom_class', 'disabled', 'dropdown_button_name', 'error', 'helper_text', 'icon_mode', 'label', 'options', 'selected', 'size', 'type'],
})
export class DdaDropdown {
  protected el: HTMLDdaDropdownElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaDropdown extends Components.DdaDropdown {}


@ProxyCmp({
  inputs: ['copyrightText', 'description', 'footerSections', 'footerTitle', 'loginButtonText', 'logoAlt', 'logoSrc', 'signUpButtonText', 'socialIcons']
})
@Component({
  selector: 'dda-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['copyrightText', 'description', 'footerSections', 'footerTitle', 'loginButtonText', 'logoAlt', 'logoSrc', 'signUpButtonText', 'socialIcons'],
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
  inputs: ['accessibility_button_name', 'close_accessibility_button_name', 'close_menu_button_name', 'close_sidebar_button_name', 'firstLogoAlt', 'firstLogoSrc', 'firstLogoWhiteSrc', 'hamburger_menu_button_name', 'language_button_name', 'language_text', 'loginIcon', 'loginLink', 'loginText', 'quickLinks', 'readSpeakerLink', 'searchText', 'search_button_name', 'search_input_name', 'secondLogoAlt', 'secondLogoSrc', 'secondLogoWhiteSrc', 'sideMenuItems', 'toggle_accessibility_button_name']
})
@Component({
  selector: 'dda-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['accessibility_button_name', 'close_accessibility_button_name', 'close_menu_button_name', 'close_sidebar_button_name', 'firstLogoAlt', 'firstLogoSrc', 'firstLogoWhiteSrc', 'hamburger_menu_button_name', 'language_button_name', 'language_text', 'loginIcon', 'loginLink', 'loginText', 'quickLinks', 'readSpeakerLink', 'searchText', 'search_button_name', 'search_input_name', 'secondLogoAlt', 'secondLogoSrc', 'secondLogoWhiteSrc', 'sideMenuItems', 'toggle_accessibility_button_name'],
})
export class DdaHeader {
  protected el: HTMLDdaHeaderElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['languageSwitch', 'smTextSize', 'baseTextSize', 'lgTextSize', 'normalContrast', 'blindContrast', 'redContrast', 'greenContrast']);
  }
}


export declare interface DdaHeader extends Components.DdaHeader {

  languageSwitch: EventEmitter<CustomEvent<void>>;

  smTextSize: EventEmitter<CustomEvent<void>>;

  baseTextSize: EventEmitter<CustomEvent<void>>;

  lgTextSize: EventEmitter<CustomEvent<void>>;

  normalContrast: EventEmitter<CustomEvent<void>>;

  blindContrast: EventEmitter<CustomEvent<void>>;

  redContrast: EventEmitter<CustomEvent<void>>;

  greenContrast: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
})
@Component({
  selector: 'dda-home-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
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
  inputs: ['aria_label', 'component_mode', 'custom_class', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_status', 'label', 'placeholder', 'size', 'type', 'validation_type', 'value']
})
@Component({
  selector: 'dda-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'component_mode', 'custom_class', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_status', 'label', 'placeholder', 'size', 'type', 'validation_type', 'value'],
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
  inputs: ['aria_label', 'component_mode', 'currencies', 'currency_button_name', 'custom_class', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_status', 'label', 'placeholder', 'selected_currency', 'size', 'toggle_button_name', 'validation_type', 'value']
})
@Component({
  selector: 'dda-number-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'component_mode', 'currencies', 'currency_button_name', 'custom_class', 'error_message', 'helper_text', 'input_id', 'input_name', 'input_status', 'label', 'placeholder', 'selected_currency', 'size', 'toggle_button_name', 'validation_type', 'value'],
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
  inputs: ['button_text_next_button', 'button_text_prev_button', 'buttons_next_button', 'buttons_pages_next_button', 'buttons_pages_prev_button', 'buttons_prev_button', 'component_mode', 'current_page', 'custom_class', 'simple_slider_next_button', 'simple_slider_prev_button', 'text_next_button', 'text_pages_next_button', 'text_pages_prev_button', 'text_prev_button', 'total_pages', 'type']
})
@Component({
  selector: 'dda-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['button_text_next_button', 'button_text_prev_button', 'buttons_next_button', 'buttons_pages_next_button', 'buttons_pages_prev_button', 'buttons_prev_button', 'component_mode', 'current_page', 'custom_class', 'simple_slider_next_button', 'simple_slider_prev_button', 'text_next_button', 'text_pages_next_button', 'text_pages_prev_button', 'text_prev_button', 'total_pages', 'type'],
})
export class DdaPagination {
  protected el: HTMLDdaPaginationElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaPagination extends Components.DdaPagination {}


@ProxyCmp({
  inputs: ['aria_label', 'button_aria_label', 'button_id', 'component_mode', 'country_select_button_name', 'custom_class', 'disabled', 'error_message', 'helper_text', 'input_id', 'label', 'phone_input_name', 'placeholder', 'size', 'toggle_button_name', 'validation_type']
})
@Component({
  selector: 'dda-phonefield',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'button_aria_label', 'button_id', 'component_mode', 'country_select_button_name', 'custom_class', 'disabled', 'error_message', 'helper_text', 'input_id', 'label', 'phone_input_name', 'placeholder', 'size', 'toggle_button_name', 'validation_type'],
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
  inputs: ['component_mode', 'custom_class', 'progress', 'show_percentage_text', 'tooltip', 'tooltip_position']
})
@Component({
  selector: 'dda-progressbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['component_mode', 'custom_class', 'progress', 'show_percentage_text', 'tooltip', 'tooltip_position'],
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
  inputs: ['aria_label', 'button_aria_label', 'button_id', 'close_button_name', 'component_mode', 'custom_class', 'error_message', 'has_error', 'helper_text', 'input_status', 'label', 'placeholder', 'search_button_name', 'search_input_name', 'show_button', 'size']
})
@Component({
  selector: 'dda-search-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'button_aria_label', 'button_id', 'close_button_name', 'component_mode', 'custom_class', 'error_message', 'has_error', 'helper_text', 'input_status', 'label', 'placeholder', 'search_button_name', 'search_input_name', 'show_button', 'size'],
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
  inputs: ['button_name', 'component_mode', 'custom_class', 'items', 'radius_type']
})
@Component({
  selector: 'dda-segmented-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['button_name', 'component_mode', 'custom_class', 'items', 'radius_type'],
})
export class DdaSegmentedTabs {
  protected el: HTMLDdaSegmentedTabsElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaSegmentedTabs extends Components.DdaSegmentedTabs {}


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
  }
}


export declare interface DdaSelect extends Components.DdaSelect {}


@ProxyCmp({
  inputs: ['accessibilityIconAlt', 'accessibilityIconHref', 'accessibilityIconSrc', 'accessibilityIconTooltip', 'aiIconAlt', 'aiIconHref', 'aiIconSrc', 'aiIconTooltip', 'chatIconAlt', 'chatIconHref', 'chatIconSrc', 'chatIconTooltip', 'firstLogoAlt', 'firstLogoHref', 'firstLogoSrc', 'firstLogoTooltip', 'happinessIconAlt', 'happinessIconHref', 'happinessIconSrc', 'happinessIconTooltip', 'hideMiddleSection', 'locationButtonHref', 'locationButtonIcon', 'locationButtonText', 'locationLogoSrc', 'newsButtonHref', 'newsButtonIcon', 'newsButtonSrc', 'newsButtonText', 'secondLogoAlt', 'secondLogoHref', 'secondLogoSrc', 'secondLogoTooltip', 'servicesIconAlt', 'servicesIconHref', 'servicesIconSrc', 'servicesIconText', 'servicesIconTooltip', 'thirdLogoAlt', 'thirdLogoHref', 'thirdLogoSrc', 'thirdLogoTooltip']
})
@Component({
  selector: 'dda-sticky-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['accessibilityIconAlt', 'accessibilityIconHref', 'accessibilityIconSrc', 'accessibilityIconTooltip', 'aiIconAlt', 'aiIconHref', 'aiIconSrc', 'aiIconTooltip', 'chatIconAlt', 'chatIconHref', 'chatIconSrc', 'chatIconTooltip', 'firstLogoAlt', 'firstLogoHref', 'firstLogoSrc', 'firstLogoTooltip', 'happinessIconAlt', 'happinessIconHref', 'happinessIconSrc', 'happinessIconTooltip', 'hideMiddleSection', 'locationButtonHref', 'locationButtonIcon', 'locationButtonText', 'locationLogoSrc', 'newsButtonHref', 'newsButtonIcon', 'newsButtonSrc', 'newsButtonText', 'secondLogoAlt', 'secondLogoHref', 'secondLogoSrc', 'secondLogoTooltip', 'servicesIconAlt', 'servicesIconHref', 'servicesIconSrc', 'servicesIconText', 'servicesIconTooltip', 'thirdLogoAlt', 'thirdLogoHref', 'thirdLogoSrc', 'thirdLogoTooltip'],
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

  tabClick: EventEmitter<CustomEvent<void>>;
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
  inputs: ['aria_label', 'checked', 'component_mode', 'custom_class', 'group_name', 'input_id', 'size']
})
@Component({
  selector: 'dda-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['aria_label', 'checked', 'component_mode', 'custom_class', 'group_name', 'input_id', 'size'],
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
  inputs: ['icon', 'image', 'link', 'linkicon', 'linktext', 'maintitle', 'subtitle', 'type']
})
@Component({
  selector: 'dda-ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['icon', 'image', 'link', 'linkicon', 'linktext', 'maintitle', 'subtitle', 'type'],
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

  linkClick: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  inputs: ['component_mode', 'current_Step', 'custom_class', 'steps']
})
@Component({
  selector: 'dda-vertical-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['component_mode', 'current_Step', 'custom_class', 'steps'],
})
export class DdaVerticalStepper {
  protected el: HTMLDdaVerticalStepperElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface DdaVerticalStepper extends Components.DdaVerticalStepper {}


