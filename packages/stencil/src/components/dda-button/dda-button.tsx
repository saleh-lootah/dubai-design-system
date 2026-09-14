import { Host, Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'dda-button',
  styleUrls: ['../../global/dda-button.css', '../../global/global.css'],
  shadow: false,
})
export class DdaButton {
  /** Native button type: `button`, `submit` or `reset`. */
  @Prop() type: string = 'button';
  /** Disables the button. */
  @Prop() disabled: boolean = false;
  /** Material Symbols icon name shown before the label, e.g. `arrow_back`. */
  @Prop() start_icon: string = '';
  /** Material Symbols icon name shown after the label, e.g. `arrow_forward`. */
  @Prop() end_icon: string = '';
  /** Accessible name. Required when the button shows only an icon. */
  @Prop() aria_label?: string = '';
  /** Color variant, e.g. `default-primary`, `default-secondary`, `error-primary`, `onsurface-link`. */
  @Prop() button_color: string = 'primary';
  /** Size: `sm`, `md`, `lg` or `xl`. */
  @Prop() size?: string;
  /** Shape: `default` or `circle`. */
  @Prop() button_shape?: string = '';
  /** Shape of an icon-only button: `default` or `circle`. */
  @Prop() icon_button_shape?: string = '';
  /** Gap between icon and label, as a spacing step: 1–6, 8, 10, 12 or 16. */
  @Prop() gap?: number;
  /** Extra CSS classes added to the inner `<button>`. */
  @Prop() custom_class?: string = '';
  /** Theme override class for the button, e.g. `light-mode`. */
  @Prop() component_mode?: string;
  /** `id` of the inner `<button>`. */
  @Prop() button_id: string;
  /** `name` of the inner `<button>`, submitted with its form. */
  @Prop() button_name?: string = '';
  /** Click handler, set as a JavaScript property. You can also listen for the native `click` event. */
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
