import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-chip',
  styleUrls: ['dda-chip.css', '../../global/global.css'],
  shadow: false,
})
export class DdaChip {
  @Prop() bg_color: string = 'success';
  @Prop() rounded?: string = '';
  @Prop() icon: string;
  @Prop() show_close_icon: boolean = false;
  @Prop() size?: string; // e.g., 'sm', 'md', 'lg'
  @Prop() custom_class?: string;
  @Prop() component_mode?: string;  
  @Prop() clickHandler?: (event: MouseEvent) => void;

  render() {
    return (
      <Host>
        <div class={`dda-chip dda-chip-${this.bg_color} dda-chip-${this.size} dda-rounded-${this.rounded} ${this.custom_class} ${this.component_mode}`}>
          {this.icon ? <i class="material-icons  material-symbols-outlined">{this.icon}</i> : null}
          <span><slot /></span>
          {this.show_close_icon && (
            <span class="chip-close"   onClick={this.clickHandler}>
              <i class="material-icons  material-symbols-outlined">close</i>
            </span>
          )}
        </div>
      </Host>
    );
  }
}
