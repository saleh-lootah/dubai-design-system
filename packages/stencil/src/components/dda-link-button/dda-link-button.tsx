import { Host, Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'dda-link-button',
  styleUrls: ['../../global/dda-button.css', '../../global/global.css',],
  shadow: false,
})
export class DdaLinkButton {
  /** Not used: the component renders an `<a>` link, which has no `type`. */
  @Prop() type: string = 'button';
  /** Not used: the link stays active. For a disabled look, set `button_color` to `disabled`. */
  @Prop() disabled: boolean = false;
  /** Material Symbols icon name shown before the label, e.g. `arrow_back`. */
  @Prop() start_icon: string = '';
  /** Material Symbols icon name shown after the label, e.g. `arrow_forward`. */
  @Prop() end_icon: string = '';
  /** Accessible name of the link. Required when the link shows only an icon. */
  @Prop() aria_label?: string = '';
  /** Color variant, e.g. `default-primary`, `default-secondary`, `error-primary`, `onsurface-link` or `disabled`. */
  @Prop() button_color: string = 'primary';
  /** Size: `sm`, `md`, `lg` or `xl`. */
  @Prop() size?: string;
  /** Shape: `default` or `circle`. */
  @Prop() button_shape?: string = '';
  /** Shape of an icon-only link: `default` or `circle`. */
  @Prop() icon_button_shape?: string = '';
  /** Gap between icon and label, as a spacing step: 1–6, 8, 10, 12 or 16. */
  @Prop() gap?: number;
  /** Extra CSS classes added to the inner `<a>`. */
  @Prop() custom_class?: string = '';
  /** URL the link opens. */
  @Prop() href?: string = '#';
  /** Theme override class for the link, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  /** `id` of the inner `<a>`. */
  @Prop() button_id: string;

  render() {
    const linkbuttonClass = [
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
        <a
        //   type={this.type}
          id={this.button_id}
          href={this.href}
          class={linkbuttonClass}
        //   disabled={this.disabled}
          aria-label={this.aria_label}
        >
          {this.start_icon && <i class="material-icons  material-symbols-outlined">{this.start_icon}</i>}
          <slot />
          {this.end_icon && <i class="material-icons  material-symbols-outlined">{this.end_icon }</i>}
        </a>
      </Host>
    );
  }
}
