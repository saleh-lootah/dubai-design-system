import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-input',
  styleUrls: ['../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaInput {
  /** Visible label text, linked to the input through `input_id`. */
  @Prop() label: string;
  /** Placeholder text of the inner `<input>`. */
  @Prop() placeholder: string;
  /** Value of the inner `<input>`. Updates as the user types. */
  @Prop() value: string;
  /** Native input type, e.g. `text`, `password`, `email`, `number`, `date` or `time`. The legacy values `Witherror` and `disabled` only apply the error or disabled styling. */
  @Prop() type: string = 'text';
  /** Helper text shown below the input and linked with `aria-describedby`. */
  @Prop() helper_text: string;
  /** Error text shown below the input. When set, the input gets `aria-invalid="true"`. */
  @Prop() error_message: string;
  /** Validation style. `error` shows the error colors. */
  @Prop() validation_type?: string;
  /** Size. `small` shows a smaller field; omit for the default size. */
  @Prop() size?: string;
  /** Status style. `disabled` shows the disabled styling only; it does not set the native `disabled` attribute. */
  @Prop() input_status?: string;
  /** Extra CSS classes added to the field container. */
  @Prop() custom_class?: string;
  /** Theme override class for the field, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  /** `id` of the inner `<input>`. Also used for the label `for` and the helper and error text ids. */
  @Prop() input_id: string;
  /** Accessible name of the inner `<input>`. Use it when there is no visible label. */
  @Prop() aria_label?: string;
  /** `name` of the inner `<input>`, submitted with its form. */
  @Prop() input_name?: string;

  handleInput(event) {
    this.value = event.target.value;
  }

  // F-016: ids are derived from the consumer-supplied input_id, the same
  // pattern dda-select's listboxId already relies on for uniqueness. If a
  // consumer omits input_id, no id-based association is emitted at all
  // (rather than colliding on a shared literal id across instances).
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
    const inputClass = [
      'dda-input-container',
      this.validation_type ? `dda-validation-${this.validation_type}` : '',
      this.size ? `dda-input-size-${this.size}` : '',
      this.input_status ? `dda-input-${this.input_status}` : '',
      this.type === 'Witherror' ? 'dda-validation-error' : '',
      this.type === 'disabled' ? 'dda-input-disabled' : '',
      this.custom_class, // Include custom class
      this.component_mode,
      this.input_name,
    ].filter(Boolean).join(' ');
    
    return (
      <Host>
        <div class={inputClass}>
          {this.label && <label htmlFor={this.input_id} class="dda-input-label">{this.label}</label>}
          <input
            aria-label={this.aria_label}
            id={this.input_id}
            name={this.input_name}
            type={this.type}
            placeholder={this.placeholder}
            value={this.value}
            onInput={(event) => this.handleInput(event)}
            class="dda-input-field dda-input-text"
            aria-describedby={this.describedBy}
            aria-invalid={this.error_message ? 'true' : undefined}
          />
          {this.helper_text && <span id={this.helperId} class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span id={this.errorId} class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}