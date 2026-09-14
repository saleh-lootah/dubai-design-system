import { Component, Prop, State, h, Host } from '@stencil/core';
import { CountriesList } from '../../assets/countries';
import { uniqueId } from '../../utils/unique-id';

@Component({
  tag: 'dda-phonefield',
  styleUrls: ['../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaPhoneField {
  /** Visible label text, linked to the phone input through `input_id`. */
  @Prop() label: string;
  /** Placeholder text of the phone input. */
  @Prop() placeholder: string = 'Enter phone number';
  /** Helper text shown below the field. Hidden when `validation_type` is set. */
  @Prop() helper_text: string;
  /** Validation style. `error` shows the error colors. Any value hides `helper_text`. */
  @Prop() validation_type?: string;
  /** Error text shown below the field. When set, the input gets `aria-invalid="true"`. */
  @Prop() error_message: string;
  /** Disables the phone input and shows the disabled styling. */
  @Prop() disabled: boolean = false;
  /** Size. `small` shows a smaller field; omit for the default size. */
  @Prop() size?: string;
  @State() country_code: string = '+971';
  @State() country_flag: string = 'https://flagcdn.com/w320/ae.png'; // Default UAE flag
  @State() phone_number: string = '';
  @State() is_focused: boolean = false;
  @State() dropdown_open: boolean = false;
  @State() countries: { code: string; flag: string }[] = [];
  /** Extra CSS classes added to the field container. */
  @Prop() custom_class: string;
  /** Theme override class for the field, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  /** `id` of the phone input. Also used for the label `for` and the helper and error text ids. When it is not set, the component generates a unique id. */
  @Prop() input_id?: string;
  /** Accessible name of the phone input. Use it when there is no visible label. */
  @Prop() aria_label: string;
  /** Prefix of the country option button ids in the open list. Each option gets `<button_id>-<index>`. When it is not set, the prefix comes from the input id. */
  @Prop() button_id?: string;
  /** Accessible name set on each country option button in the open list. */
  @Prop() button_aria_label: string;
  /** `name` of the country code dropdown button. */
  @Prop() toggle_button_name: string;
  /** `name` of each country option button. */
  @Prop() country_select_button_name: string;
  /** Accessible name of the country code dropdown button; the selected code is added after it. */
  @Prop() toggle_button_label: string = 'Choose country code';
  /** `name` of the phone input, submitted with its form. */
  @Prop() phone_input_name: string;
  // F-018 (WCAG 1.3.5): telephone is exactly the field type autocomplete
  // exists for. Default to the correct token; still overridable.
  // The country code is chosen separately, so the input holds the national
  // number only: `tel-national` fits it better than `tel`.
  /** `autocomplete` token of the phone input. Defaults to `tel-national`, because the country code is chosen separately. */
  @Prop() autocomplete: string = 'tel-national';

  // Fallback id so the label is never orphaned when no input_id is passed.
  private readonly fallbackId = uniqueId('dda-phonefield');

  private get inputId(): string {
    return this.input_id || this.fallbackId;
  }

  // F-016: ids derived from the input id, same pattern as dda-input/dda-select.
  private get helperId(): string {
    return `${this.inputId}-helper`;
  }

  private get errorId(): string {
    return `${this.inputId}-error`;
  }

  private get describedBy(): string | undefined {
    const ids = [
      this.helper_text && !this.validation_type ? this.helperId : undefined,
      this.error_message ? this.errorId : undefined,
    ].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
  }

  // componentWillLoad() {
  //   fetch('/path/to/countries.json')
  //     .then(response => response.json())
  //     .then(data => {
  //       this.countries = data;
  //     });
  // }

  componentWillLoad() {
    this.countries = CountriesList;
  }
  toggleDropdown() {
    this.dropdown_open = !this.dropdown_open;
  }

  selectCountry(country: { code: string; flag: string }) {
    this.country_code = country.code;
    this.country_flag = country.flag;
    this.dropdown_open = false;
  }

  handleFocus() {
    this.is_focused = true;
  }

  handleBlur() {
    this.is_focused = false;
  }

  handlephonenumberChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const targetvalue = target.value.replace(/[^0-9.]/g, '');
    // type="tel" does not block other characters, so write the filtered
    // value back. Leading zeros are digits and stay.
    if (target.value !== targetvalue) {
      target.value = targetvalue;
    }
    this.phone_number = targetvalue;
    }

  render() {
    const inputClass = `${this.component_mode} ${this.size ? `dda-input-size-${this.size}` : ''} ${this.error_message ? `dda-error-message` : ''}  ${this.validation_type ? `dda-validation-${this.validation_type}` : ''}  ${this.is_focused ? 'dda-input-focus' : ''} ${this.phone_number ? 'dda-input-focus-filled' : '' }`;
    const id = this.inputId;
    return (
      <Host>
        <div class={`dda-input-container ${inputClass} ${this.custom_class} ${this.disabled ? 'dda-input-disabled' : ''}`}>
          {this.label && <label htmlFor={id} class="dda-input-label">{this.label}</label>}
          <div class={`dda-input-field-group dda-phone-field`}>
            <div class="dda-input-dropdown-btn">
              <button type="button" name={this.toggle_button_name}  class="dda-dropdown-select" aria-label={this.toggle_button_label ? `${this.toggle_button_label}: ${this.country_code}` : undefined} aria-expanded={this.dropdown_open ? 'true' : 'false'} onClick={() => this.toggleDropdown()}>
                <img src={this.country_flag} alt="" width="20" /> {this.country_code} <i class={`material-icons`} aria-hidden="true">{this.dropdown_open ? 'keyboard_arrow_down' : 'keyboard_arrow_down'}</i>
              </button>
              {this.dropdown_open && (
                <div class="dda-input-dropdown-list">
                  {this.countries.map((country, index) => (
                    <button id={`${this.button_id || `${id}-country`}-${index}`} name={this.country_select_button_name} aria-label={this.button_aria_label} type="button" class="dda-input-dropdown-item" onClick={() => this.selectCountry(country)}>
                      <img src={country.flag} alt="" width="20" /> {country.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              id={id}
              name={this.phone_input_name}
              aria-label={this.aria_label}
              type="tel"
              class={`dda-field-group-input`}
              placeholder={this.placeholder}
              inputmode='tel'
              pattern={"[0-9]*"}
              autocomplete={this.autocomplete}
              value={this.phone_number}
              onInput={this.handlephonenumberChange.bind(this)}
              onFocus={this.handleFocus.bind(this)}
              onBlur={this.handleBlur.bind(this)}
              disabled={this.disabled}
              aria-describedby={this.describedBy}
              aria-invalid={this.error_message ? 'true' : undefined}
            />
          </div>
          {this.helper_text && !this.validation_type && <span id={this.helperId} class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span id={this.errorId} class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}
