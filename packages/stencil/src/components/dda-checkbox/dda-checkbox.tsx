import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-checkbox',
  styleUrls: ['dda-checkbox.css', '../../global/global.css'],
  shadow: false,
})
export class DdaCheckbox {
  /** Label shown next to the checkbox. */
  @Prop() title_text: string;
  /** Secondary text shown under the title. */
  @Prop() supporting?: string;
  /** `name` of the inner checkbox input. */
  @Prop() group_name?: string;
  /** `id` of the inner checkbox input. The label points to it, so set a unique value to make the label clickable. */
  @Prop() input_id?: string;
  /** Checked state of the inner input. Read the current state from the input or its `change` event. */
  @Prop() checked: boolean;
  /** Status: `disabled` shows the disabled style and blocks pointer clicks. */
  @Prop() checkbox_status?: string;
  /** Size: `sm`, `md` or `lg`. */
  @Prop() size?: string;
  /** Box shape: `square` or `rounded`. */
  @Prop() style_type?: string;
  /** Extra CSS classes added to the checkbox container. */
  @Prop() custom_class?: string = ''; 
  /** Theme override class for the checkbox, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  /** Accessible name of the inner checkbox input. */
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
