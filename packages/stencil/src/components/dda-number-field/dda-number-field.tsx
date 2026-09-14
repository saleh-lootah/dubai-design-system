import { Component, Prop, State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-number-field',
  styleUrls: ['../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaNumberField {
  /** Placeholder text of the amount input. */
  @Prop() placeholder: string;
  /** Visible label text, linked to the amount input through `input_id`. */
  @Prop() label: string;
  /** Initial value of the amount input. Characters other than digits and `.` are removed as the user types. */
  @Prop() value: string;
  /** Helper text shown below the field and linked with `aria-describedby`. */
  @Prop() helper_text: string;
  /** Error text shown below the field. When set, the input gets `aria-invalid="true"`. */
  @Prop() error_message: string;
  /** Validation style. `error` shows the error colors. */
  @Prop() validation_type?: string;
  /** Size. `small` shows a smaller field; omit for the default size. */
  @Prop() size?: string;
  /** Status style. `disabled` shows the disabled styling only; it does not set the native `disabled` attribute. */
  @Prop() input_status?: string;
  /** Currency options for the dropdown, as a JSON array string, e.g. `'["AED","USD"]'`. */
  @Prop() currencies: string;
  /** Currency shown on the dropdown button. Updates when the user picks a currency. */
  @Prop() selected_currency: string = 'USD';
  @State() is_focused: boolean = false;
  /** Extra CSS classes added to the field container. */
  @Prop() custom_class?: string = '';
  /** Theme override class for the field, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  /** `id` of the amount input. Also used for the label `for` and the helper and error text ids. */
  @Prop() input_id: string;
  /** Accessible name of the amount input. Use it when there is no visible label. */
  @Prop() aria_label?: string;
  /** `name` of the amount input, submitted with its form. */
  @Prop() input_name?: string;
  /** `name` of the currency dropdown button. */
  @Prop() toggle_button_name?: string;
  /** `name` of each currency option button. */
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

  // F-016: ids derived from the consumer-supplied input_id, same pattern as
  // dda-input/dda-select.
  private get helperId(): string | undefined {
    return this.input_id ? `${this.input_id}-helper` : undefined;
  }

  private get errorId(): string | undefined {
    return this.input_id ? `${this.input_id}-error` : undefined;
  }

  private get describedBy(): string | undefined {
    const ids = [
      this.helper_text ? this.helperId : undefined,
      this.error_message ? this.errorId : undefined,
    ].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
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
              aria-describedby={this.describedBy}
              aria-invalid={this.error_message ? 'true' : undefined}
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
          {this.helper_text && <span id={this.helperId} class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span id={this.errorId} class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}
