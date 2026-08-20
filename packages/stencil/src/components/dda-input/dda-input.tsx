import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-input',
  styleUrls: ['../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaInput {
  @Prop() label: string;
  @Prop() placeholder: string;
  @Prop() value: string;
  @Prop() type: string = 'text';
  @Prop() helper_text: string;
  @Prop() error_message: string;
  @Prop() validation_type?: string;
  @Prop() size?: string;
  @Prop() input_status?: string;
  @Prop() custom_class?: string;
  @Prop() component_mode?: string; 
  @Prop() input_id: string;
  @Prop() aria_label?: string;
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