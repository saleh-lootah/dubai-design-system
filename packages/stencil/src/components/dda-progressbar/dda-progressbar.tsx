import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-progressbar',
  styleUrls: ['dda-progressbar.css', '../../global/global.css'],
  shadow: false,
})
export class DdaProgressBar {
  /** Progress in percent, from 0 to 100. Sets the bar width and `aria-valuenow`. */
  @Prop() progress: number = 0;
  /** Shows the percentage in a tooltip at the end of the filled bar. */
  @Prop() tooltip: boolean = false;
  /** Tooltip position: `top` or `bottom`. */
  @Prop() tooltip_position: 'top' | 'bottom' = 'top';
  /** Shows the percentage as text after the bar. */
  @Prop() show_percentage_text: boolean = false;
  /** Extra CSS classes added to the progress bar container. */
  @Prop() custom_class: string;
  /** Theme override class for the progress bar, e.g. `light-mode`. */
  @Prop() component_mode?: string;
  /** Accessible name of the progress bar. */
  @Prop() aria_label: string = 'Progress';

  render() {
    const progressStyle = {
      width: `${this.progress}%`,
    };

    return (
      <Host>
        <div class={`dda-progress-bar-container ${this.custom_class} ${this.component_mode}`}>
          <div
            class="dda-progress-bar"
            role="progressbar"
            aria-label={this.aria_label}
            aria-valuenow={`${this.progress}`}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div class="dda-progress-value" style={progressStyle}>
              {this.tooltip && (
                <div class={`dda-tooltip tooltip-${this.tooltip_position}`}>
                  {this.progress}%
                </div>
              )}
            </div>
          </div>
          {this.show_percentage_text && (
            <span class="dda-percentage-text">{this.progress}%</span>
          )}
        </div>
      </Host>
    );
  }
}
