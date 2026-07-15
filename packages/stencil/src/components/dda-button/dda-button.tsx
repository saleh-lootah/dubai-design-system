import { Host, Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'dda-button',
  styleUrls: ['../../global/dda-button.css', '../../global/global.css'],
  shadow: false,
})
export class DdaButton {
  /** Type of button, e.g., "button", "submit" */
  @Prop() type: string = 'button';
  /** Disable the button */
  @Prop() disabled: boolean = false;
  /** Icon class for the starting icon */
  @Prop() start_icon: string = '';
  @Prop() end_icon: string = ''; // icon class
  @Prop() aria_label?: string = '';
  @Prop() button_color: string = 'primary'; // e.g., 'primary', 'error'
  @Prop() size?: string; // e.g., 'sm', 'md', 'lg'
  @Prop() button_shape?: string = '';
  @Prop() icon_button_shape?: string = '';
  @Prop() gap?: number;
  @Prop() custom_class?: string = ''; // Custom class prop
  @Prop() component_mode?: string;
  @Prop() button_id: string;
  @Prop() button_name?: string = '';
  /** Function to be called on button click */
  @Prop() clickHandler?: (event: MouseEvent) => void;

  render() {
    const buttonClass = [
      'dda-btn',
      `btn-color-${this.button_color}`,
      this.size ? `btn-size-${this.size}` : '',
      this.button_shape ? `btn-shape-${this.button_shape}` : '',
      this.icon_button_shape ? `icon-btn-${this.icon_button_shape}` : '',
      this.gap ? `dda-gap-${this.gap}` : '',
      this.custom_class, // Include custom class
      this.component_mode,
    ].filter(Boolean).join(' ');

    return (
      <Host>
        <button
          id={this.button_id}
          type={this.type}
          class={buttonClass}
          disabled={this.disabled}
          aria-label={this.aria_label}
          onClick={this.clickHandler} // Bind the onClick prop here
          name={this.button_name}
        >
          {this.start_icon && <i class="material-icons  material-symbols-outlined">{this.start_icon}</i>}
          <slot />
          {this.end_icon && <i class="material-icons  material-symbols-outlined">{this.end_icon }</i>}
        </button>
      </Host>
    );
  }
}
