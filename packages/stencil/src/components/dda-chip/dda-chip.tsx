import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-chip',
  styleUrls: ['dda-chip.css', '../../global/global.css'],
  shadow: false,
})
export class DdaChip {
  /** Color: `grey`, `primary`, `green`, `yellow`, `red` or `purple`. Other values, including the default, use the base primary style. */
  @Prop() bg_color: string = 'success';
  /** Corner radius: `sm`, `md`, `lg` or `circle`. */
  @Prop() rounded?: string = '';
  /** Material Symbols icon name shown before the label, e.g. `check_circle`. */
  @Prop() icon: string;
  /** Shows a close button with the accessible name `Remove` after the label. */
  @Prop() show_close_icon: boolean = false;
  /** Height: `sm` (24px), `md` (26px) or `lg` (32px). */
  @Prop() size?: string;
  /** Extra CSS classes added to the chip container. */
  @Prop() custom_class?: string;
  /** Theme override class for the chip, e.g. `light-mode`. */
  @Prop() component_mode?: string;  
  /** Click handler for the close button, set as a JavaScript property. The chip does not remove itself. */
  @Prop() clickHandler?: (event: MouseEvent) => void;

  render() {
    return (
      <Host>
        <div class={`dda-chip dda-chip-${this.bg_color} dda-chip-${this.size} dda-rounded-${this.rounded} ${this.custom_class} ${this.component_mode}`}>
          {this.icon ? <i class="material-icons  material-symbols-outlined">{this.icon}</i> : null}
          <span><slot /></span>
          {this.show_close_icon && (
            <button type="button" class="chip-close" onClick={this.clickHandler} aria-label="Remove">
              <i class="material-icons  material-symbols-outlined">close</i>
            </button>
          )}
        </div>
      </Host>
    );
  }
}
