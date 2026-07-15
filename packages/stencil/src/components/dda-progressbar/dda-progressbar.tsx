import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-progressbar',
  styleUrls: ['dda-progressbar.css', '../../global/global.css'],
  shadow: false,
})
export class DdaProgressBar {
  @Prop() progress: number = 0;
  @Prop() tooltip: boolean = false;
  @Prop() tooltip_position: 'top' | 'bottom' = 'top';
  @Prop() show_percentage_text: boolean = false;
  @Prop() custom_class: string;
  @Prop() component_mode?: string; 

  render() {
    const progressStyle = {
      width: `${this.progress}%`,
    };

    return (
      <Host>
        <div class={`dda-progress-bar-container ${this.custom_class} ${this.component_mode}`}>
          <div class="dda-progress-bar">
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
