import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-radiobutton',
  styleUrl: 'dda-radiobutton.css',
  shadow: false,
})
export class DdaRadiobutton {
  /** Label shown next to the radio button. */
  @Prop() title_text: string;
  /** Secondary text shown under the title. */
  @Prop() supporting?: string;
  /** `name` of the inner radio input. Give all radio buttons in one group the same value. */
  @Prop() group_name?: string;
  /** `id` of the inner radio input. The label points to it, so set a unique value to make the label clickable. */
  @Prop() input_id?: string;
  /** Checked state of the inner input. Read the current state from the input or its `change` event. */
  @Prop() checked: boolean;
  /** Status: `disabled` shows the disabled style and blocks pointer clicks. */
  @Prop() radio_status?: string;
  /** Size: `sm`, `md` or `lg`. */
  @Prop() size?: string;
  /** Style variant: `outlined` or `faded`. Leave empty (or `normal`) for the default style. */
  @Prop() variants?: string;
  /** Extra class suffix. The value is added as `dda-radio-<value>` on the container. */
  @Prop() custom_class?: string = ''; 
  /** Theme override class for the radio button, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  /** Accessible name of the inner radio input. */
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

