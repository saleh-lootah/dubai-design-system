import { Component, Prop, State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-number-field',
  styleUrls: ['../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaNumberField {
  @Prop() placeholder: string;
  @Prop() label: string;
  @Prop() value: string;
  @Prop() helper_text: string;
  @Prop() error_message: string;
  @Prop() validation_type?: string;
  @Prop() size?: string;
  @Prop() input_status?: string; // JSON string of currency options
  @Prop() currencies: string;
  @Prop() selected_currency: string = 'USD';
  @State() is_focused: boolean = false;
  @Prop() custom_class?: string = '';
  @Prop() component_mode?: string; 
  @Prop() input_id: string;
  @Prop() aria_label?: string;
  @Prop() input_name?: string;
  @Prop() toggle_button_name?: string;
  @Prop() currency_button_name?: string;

  @State() isCurrencyDropdownOpen: boolean = false;

  handleInput(event) {
    const inputElement = event.target as HTMLInputElement
    const inputValue = inputElement.value.replace(/[^0-9.]/g, '');
    inputElement.value = inputValue;
  }
  handleFocus() {
    this.is_focused = true;
  }

  handleBlur() {
    this.is_focused = false;
  }
  toggleCurrencyDropdown() {
    this.isCurrencyDropdownOpen = !this.isCurrencyDropdownOpen;
    this.handleFocus();
    this.handleBlur();
  }

  selectCurrency(currency: string) {
    this.selected_currency = currency;
    this.isCurrencyDropdownOpen = false;
  }

  private get parsedCurrencies(): string[] {
    try {
      return JSON.parse(this.currencies);
    } catch {
      return [];
    }
  }

  render() {
    const containerClass = [
      'dda-input-container',
      this.validation_type ? `dda-validation-${this.validation_type}` : '',
      this.size ? `dda-input-size-${this.size}` : '',
      this.input_status ? `dda-input-${this.input_status}` : '',
      this.is_focused ? 'dda-input-focus' : '',
      this.error_message ? 'dda-error-message' : '',
      this.custom_class ? `${this.custom_class}` : '',
      this.component_mode,
    ].filter(Boolean).join(' ');

    return (
      <Host>
        <div class={containerClass}>
          {this.label && <label htmlFor={this.input_id} class="dda-input-label">{this.label}</label>}
          <div class="dda-input-field-group dda-number-field">
            <input
              id={this.input_id}
              name={this.input_name}
              aria-label={this.aria_label}
              type="text"
              placeholder={this.placeholder}
              value={this.value}
              pattern={"[0-9]*"}
              onInput={event => this.handleInput(event)}
              onFocus={this.handleFocus.bind(this)}
              onBlur={this.handleBlur.bind(this)}
              class="dda-field-group-input"
            />
            <div class="dda-input-dropdown-btn">
              <button name={this.toggle_button_name} type="button" class="dda-dropdown-select" onClick={() => this.toggleCurrencyDropdown()}>
                {this.selected_currency} <i class={`material-icons`}>{this.isCurrencyDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
              </button>
              {this.isCurrencyDropdownOpen && (
                <div class="dda-input-dropdown-list">
                  {this.parsedCurrencies.length > 0 ? (
                    this.parsedCurrencies.map(option => (
                      <button name={this.currency_button_name} type="button" class={`dda-input-dropdown-item ${this.selected_currency === option ? 'selected' : ''}`} onClick={() => this.selectCurrency(option)}>
                        {option}
                      </button>
                    ))
                  ) : (
                    <div class="dda-input-dropdown-item">No options available</div>
                  )}
                </div>
              )}
            </div>
          </div>
          {this.helper_text && <span class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}
