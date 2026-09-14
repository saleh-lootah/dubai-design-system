import { Component, Prop,  State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-creditcard-field',
  styleUrls: ['../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaCreditCardField {
  /** Placeholder text of the input, e.g. `0000 - 0000 - 0000 - 0000`. */
  @Prop() placeholder: string;
  /** Label text shown above the input. Linked to the input when `input_id` is set. */
  @Prop() label: string;
  /** Card number. Shown as groups of four digits separated by ` - `; the component updates it as the user types. */
  @Prop() value: string = '';
  /** URL of an image shown at the start of the input, e.g. a card brand logo. */
  @Prop() card_icon: string;
  /** Error text shown below the input. Also sets `aria-invalid="true"` on the input. */
  @Prop() error_message: string;
  /** Validation state: `error` applies the error colors. */
  @Prop() validation_type?: string;
  /** Size: `default` or `small`. */
  @Prop() size?: string;
  /** Adds the class `dda-input-<value>`. `disabled` gives only the disabled look; use `disabled` to disable the input. */
  @Prop() input_type?: string;
  /** Helper text shown below the input. Linked by `aria-describedby` when `input_id` is set. */
  @Prop() helper_text: string;
  /** Disables the input and applies the disabled look. */
  @Prop() disabled: boolean = false;
  /** Extra CSS classes added to the field container. */
  @Prop() custom_class?: string = '';
  /** Sets the input `maxlength`: 25 characters when `false` (16 digits with separators), 100 when `true`. */
  @Prop() restrict_input: boolean = false;
  /** Theme override class for the field, e.g. `light-mode`. */
  @Prop() component_mode?: string;
  /** `id` of the inner `<input>`. Also used to link the label, helper text and error message. */
  @Prop() input_id: string;
  /** Accessible name of the input. Use it when there is no visible `label`. */
  @Prop() aria_label?: string;
  /** `name` of the inner `<input>`, submitted with its form. */
  @Prop() input_name?: string;
  // F-018 (WCAG 1.3.5): card number is exactly the field type autocomplete
  // exists for. Default to the correct token; still overridable.
  /** `autocomplete` token of the input. Defaults to `cc-number`. */
  @Prop() autocomplete: string = 'cc-number';

  @State() formattedValue: string = '';

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
              autocomplete={this.autocomplete}
              placeholder={this.placeholder}
              value={this.formattedValue}
              onInput={(event) => this.handleInput(event)}
              class="dda-input-field"
              disabled={this.disabled}
              maxlength={this.restrict_input ? 100 : 25}
              aria-describedby={this.describedBy}
              aria-invalid={this.error_message ? 'true' : undefined}
            />
          </div>
          {this.helper_text && <span id={this.helperId} class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span id={this.errorId} class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}