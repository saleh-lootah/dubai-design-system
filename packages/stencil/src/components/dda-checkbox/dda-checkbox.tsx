import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-checkbox',
  styleUrls: ['dda-checkbox.css', '../../global/global.css'],
  shadow: false,
})
export class DdaCheckbox {
  @Prop() title_text: string;
  @Prop() supporting?: string;
  @Prop() group_name?: string;
  @Prop() input_id?: string;
  @Prop() checked: boolean;
  @Prop() checkbox_status?: string;
  @Prop() size?: string; // e.g., 'sm', 'md', 'lg'
  @Prop() style_type?: string; // Default to 'square'
  @Prop() custom_class?: string = ''; 
  @Prop() component_mode?: string; 
  @Prop() aria_label?: string;

  render() {
    const checkboxClass = [
      'dda-checkbox-container',
      this.size ? `dda-checkbox-${this.size}` : '',
      this.style_type ? `dda-checkbox-${this.style_type}` : '',
      this.custom_class ?  this.custom_class : '',
      this.checkbox_status ? `dda-checkbox-${this.checkbox_status}` : '',
      this.component_mode,
    ].filter(Boolean).join(' ');
    
    return (
      <Host>
        <div class={checkboxClass}>
          <input aria-label={this.aria_label} type="checkbox" id={this.input_id} name={this.group_name} checked={this.checked}/>
          <label htmlFor={this.input_id}>
            <i class="material-icons  material-symbols-outlined">check</i>
            <p>
              <span class="dda-checkbox-title">{this.title_text}</span>
              {this.supporting && <span class="dda-checkbox-supporting">{this.supporting}</span>}
            </p>
          </label>
        </div>
      </Host>
    );
  }
}
