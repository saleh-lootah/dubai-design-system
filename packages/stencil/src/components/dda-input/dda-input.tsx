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
          />
          {this.helper_text && <span class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}