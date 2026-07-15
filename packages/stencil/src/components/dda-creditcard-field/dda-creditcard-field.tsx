import { Component, Prop,  State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-creditcard-field',
  styleUrls: ['../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaCreditCardField {
  @Prop() placeholder: string;
  @Prop() label: string;
  @Prop() value: string = '';
  @Prop() card_icon: string;
  @Prop() error_message: string;
  @Prop() validation_type?: string;
  @Prop() size?: string;
  @Prop() input_type?: string;
  @Prop() helper_text: string;
  @Prop() disabled: boolean = false;
  @Prop() custom_class?: string = '';
  @Prop() restrict_input: boolean = false;
  @Prop() component_mode?: string; 
  @Prop() input_id: string;
  @Prop() aria_label?: string;
  @Prop() input_name?: string;

  @State() formattedValue: string = '';

  handleInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value.replace(/[^0-9-]/g, '');
    const maxLength = this.restrict_input ? 100 : 25;
    
    if (inputValue.length <= maxLength) {
      this.value = inputValue;
      this.formatCardNumber(this.value);
      inputElement.value = this.formattedValue;
    } else {
      inputElement.value = this.formattedValue;
    }
  }

  formatCardNumber(value: string) {
    const cleaned = value.replace(/\D/g, '');
    const matched = cleaned.match(/.{1,4}/g);
    if (matched) {
      this.formattedValue = matched.join(' - ');
    } else {
      this.formattedValue = cleaned;
    }
  }

  componentWillLoad() {
    this.formatCardNumber(this.value);
  }

  render() {
    const inputClass = [
      'dda-input-container dda-credit-card-field',
      this.validation_type ? `dda-validation-${this.validation_type}` : '',
      this.size ? `dda-input-size-${this.size}` : '',
      this.input_type ? `dda-input-${this.input_type}` : '',
      this.disabled ? 'dda-input-disabled' : '',
      this.error_message ? 'dda-error-message' : '',
      this.custom_class ? `${this.custom_class}` : '',
      this.component_mode, 
    ].filter(Boolean).join(' ');

    return (
      <Host>
        <div class={inputClass}>
          {this.label && <label htmlFor={this.input_id} class="dda-input-label">{this.label}</label>}
          <div class="dda-input-field-wrapper">
            {this.card_icon && <img src={this.card_icon} alt="Card Icon" class="dda-creditcard-icon" />}
            <input
              aria-label={this.aria_label}
              id={this.input_id}
              name={this.input_name}
              type="text"
              inputmode="numeric"
              placeholder={this.placeholder}
              value={this.formattedValue}
              onInput={(event) => this.handleInput(event)}
              class="dda-input-field"
              disabled={this.disabled}
              maxlength={this.restrict_input ? 100 : 25}
            />
          </div>
          {this.helper_text && <span class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}