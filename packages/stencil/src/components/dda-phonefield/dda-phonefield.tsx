import { Component, Prop, State, h, Host } from '@stencil/core';
import { CountriesList } from '../../assets/countries';

@Component({
  tag: 'dda-phonefield',
  styleUrls: ['../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaPhoneField {
  @Prop() label: string;
  @Prop() placeholder: string = 'Enter phone number';
  @Prop() helper_text: string;
  @Prop() validation_type?: string;
  @Prop() error_message: string;
  @Prop() disabled: boolean = false;
  @Prop() size?: string;
  @State() country_code: string = '+971';
  @State() country_flag: string = 'https://flagcdn.com/w320/ae.png'; // Default UAE flag
  @State() phone_number: string = '';
  @State() is_focused: boolean = false;
  @State() dropdown_open: boolean = false;
  @State() countries: { code: string; flag: string }[] = [];
  @Prop() custom_class: string;
  @Prop() component_mode?: string; 
  @Prop() input_id?: string;
  @Prop() aria_label: string;
  @Prop() button_id?: string;
  @Prop() button_aria_label: string;
  @Prop() toggle_button_name: string;
  @Prop() country_select_button_name: string;
  @Prop() phone_input_name: string;

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
    this.phone_number = targetvalue;
    }

  render() {
    const inputClass = `${this.component_mode} ${this.size ? `dda-input-size-${this.size}` : ''} ${this.error_message ? `dda-error-message` : ''}  ${this.validation_type ? `dda-validation-${this.validation_type}` : ''}  ${this.is_focused ? 'dda-input-focus' : ''} ${this.phone_number ? 'dda-input-focus-filled' : '' }`;
    return (
      <Host>
        <div class={`dda-input-container ${inputClass} ${this.custom_class} ${this.disabled ? 'dda-input-disabled' : ''}`}>
          {this.label && <label htmlFor={this.input_id} class="dda-input-label">{this.label}</label>}
          <div class={`dda-input-field-group dda-phone-field`}>
            <div class="dda-input-dropdown-btn">
              <button type="button" name={this.toggle_button_name}  class="dda-dropdown-select" onClick={() => this.toggleDropdown()}>
                <img src={this.country_flag} alt="" width="20" /> {this.country_code} <i class={`material-icons`}>{this.dropdown_open ? 'keyboard_arrow_down' : 'keyboard_arrow_down'}</i>
              </button>
              {this.dropdown_open && (
                <div class="dda-input-dropdown-list">
                  {this.countries.map(country => (
                    <button id={this.button_id} name={this.country_select_button_name} aria-label={this.button_aria_label} type="button" class="dda-input-dropdown-item" onClick={() => this.selectCountry(country)}>
                      <img src={country.flag} alt="" width="20" /> {country.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              id={this.input_id}
              name={this.phone_input_name}
              aria-label={this.aria_label}
              type="number"
              class={`dda-field-group-input`}
              placeholder={this.placeholder}
              inputmode='numeric'
              pattern={"[0-9]*"}
              value={this.phone_number}
              onInput={this.handlephonenumberChange.bind(this)}
              onFocus={this.handleFocus.bind(this)}
              onBlur={this.handleBlur.bind(this)}
              disabled={this.disabled}
            />
          </div>
          {this.helper_text && !this.validation_type && <span class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}
