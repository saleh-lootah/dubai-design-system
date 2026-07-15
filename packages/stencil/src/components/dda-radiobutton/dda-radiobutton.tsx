import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-radiobutton',
  styleUrl: 'dda-radiobutton.css',
  shadow: false,
})
export class DdaRadiobutton {
  @Prop() title_text: string;
  @Prop() supporting?: string;
  @Prop() group_name?: string;
  @Prop() input_id?: string;
  @Prop() checked: boolean;
  @Prop() radio_status?: string;
  @Prop() size?: string; // e.g., 'sm', 'md', 'lg'
  @Prop() variants?: string; // e.g., 'sm', 'md', 'lg'
  @Prop() custom_class?: string = ''; 
  @Prop() component_mode?: string; 
  @Prop() aria_label?: string;
  
  render() {
    const radiobuttonClass = [
      'dda-radio-container',
      this.size ? `dda-radio-${this.size}` : '',
      this.variants ? `dda-radio-${this.variants}` : '',
      this.custom_class ? `dda-radio-${this.custom_class}` : '',
      this.radio_status ? `dda-radio-${this.radio_status}` : '',
      this.component_mode,
    ].filter(Boolean).join(' ');
    
    return (
      <Host>
        <div class={radiobuttonClass}>
          <input aria-label={this.aria_label} type="radio" id={this.input_id} name={this.group_name} checked={this.checked}/>
          <label htmlFor={this.input_id}>
            <span class="radio-circle"></span>
            <p>
              <span class="radio-title">{this.title_text}</span>
              {this.supporting && <span class="radio-supporting">{this.supporting}</span>}
            </p>
          </label>
        </div>
      </Host>
    );
  }
}

