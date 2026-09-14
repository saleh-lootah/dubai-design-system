import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-toggle',
  styleUrls: ['../../global/global.css', 'dda-toggle.css'],
  shadow: false,
})
export class DdaToggle {
  /** Checked (on) state of the inner input. Read the current state from the input or its `change` event. */
  @Prop() checked: boolean;
 // @Prop() labelOn: string = 'On';
  //@Prop() labelOff: string = 'Off';
  /** Size: `sm`, `md` or `lg`. */
  @Prop() size?: string;
  /** Extra CSS classes added to the toggle label. */
  @Prop() custom_class?: string = '';
  /** `name` of the inner checkbox input. */
  @Prop() group_name?: string;
  /** `id` of the inner checkbox input. */
  @Prop() input_id?: string;
  /** Theme override class for the toggle, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  /** Accessible name of the inner checkbox input. Set it when there is no `title_text`. */
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
