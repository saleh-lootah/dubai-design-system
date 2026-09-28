// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Host, Prop, h } from '@stencil/core';

// A decorative "scroll down" mouse icon. It carries no information, so it is hidden from
// assistive technology, and its dot moves only when the user has not asked for reduced motion.
@Component({
  tag: 'dda-scroll-icon',
  styleUrls: ['dda-scroll-icon.css'],
  shadow: false,
})
export class DdaScrollIcon {
  /** Size: `sm` (16.5 × 24px) or `lg` (40 × 60px). Default: `sm`. */
  @Prop() scroll_icon_size: 'sm' | 'lg' = 'sm';
  /** Colour: `white` or `black`. Default: `white`. */
  @Prop() scroll_icon_color: 'white' | 'black' = 'white';
  /** Extra CSS classes on the icon. */
  @Prop() custom_class: string = '';
  /** Theme override class, e.g. `light-mode`. */
  @Prop() component_mode: string;

  render() {
    const className = [
      'dda-scroll-icon-scroll',
      `scroll-icon-size-${this.scroll_icon_size || 'sm'}`,
      `scroll-icon-color-${this.scroll_icon_color || 'white'}`,
      this.custom_class,
      this.component_mode,
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <Host aria-hidden="true">
        <div class={className}>
          <div class="dda-scroll-icon-scroll-dot"></div>
        </div>
      </Host>
    );
  }
}
