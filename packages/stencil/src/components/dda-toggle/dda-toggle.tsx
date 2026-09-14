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
  /** Label shown next to the switch. Nothing is shown when it is not set. */
  @Prop() title_text?: string;
  /** Secondary text shown under the title. */
  @Prop() supporting?: string;

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
            {(this.title_text || this.supporting) && (
              <p>
                {this.title_text && <span class="toggle-title">{this.title_text}</span>}
                {this.supporting && <span class="toggle-supporting">{this.supporting}</span>}
              </p>
            )}
        </label>
      </Host>
    );
  }
}
