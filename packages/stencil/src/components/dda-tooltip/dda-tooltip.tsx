import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-tooltip',
  styleUrls: ['../../global/global.css', 'dda-tooltip.css'],
  shadow: false,
})
export class DdaTooltip {
  @Prop() title_text: string;
  @Prop() description: string;
  @Prop() position: 'top' | 'bottom' | 'left' | 'right' = 'top'; // Default to top position
  @Prop() custom_class?: string = ''; 
  @Prop() component_mode?: string; 

  render() {
    return (
      <Host>
        <div class={`dda-tooltip-container ${this.custom_class} ${this.component_mode}`}>
          <slot></slot>
          <div class={`dda-tooltip-box ${this.position}`}>
            <strong>{this.title_text}</strong>
            <p>{this.description}</p>
          </div>
        </div>
      </Host>
    );
  }
}