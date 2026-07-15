import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-toggle',
  styleUrls: ['../../global/global.css', 'dda-toggle.css'],
  shadow: false,
})
export class DdaToggle {
  @Prop() checked: boolean;
 // @Prop() labelOn: string = 'On';
  //@Prop() labelOff: string = 'Off';
  @Prop() size?: string; // e.g., 'sm', 'md', 'lg'
  @Prop() custom_class?: string = '';
  @Prop() group_name?: string;
  @Prop() input_id?: string;
  @Prop() component_mode?: string; 
  @Prop() aria_label: string;

  render() {
    const toggleClass = [
      'dda-toggle-btn',
      this.size ? `dda-toggle-${this.size}` : '',
      this.custom_class ? `${this.custom_class}` : '',
      this.component_mode,
    ].filter(Boolean).join(' ');

    return (
      <Host>
        <label class={toggleClass} htmlFor={this.input_id}>
          <input aria-label={this.aria_label} type="checkbox" id={this.input_id} name={this.group_name} checked={this.checked}/>
            <span class="toggle"></span> 
            <p>
              <span class="toggle-title">Radio Button Title</span>
              <span class="toggle-supporting">Supporting Text</span>
            </p>
        </label>
      </Host>
    );
  }
}
