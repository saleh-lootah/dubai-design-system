import { Component, Prop, State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-range-slider',
  styleUrl: 'dda-range-slider.css',
  shadow: false,
})
export class DdaRangeSlider {
  @Prop() min: number = 0;
  @Prop() max: number = 100;
  @Prop() step: number = 1;
  @Prop() initial_min: number = 0;
  @Prop() initial_max: number = 100;
  @Prop() size?: string;
  @Prop() tooltip_position?: string;
  @State() min_value: number;
  @State() max_value: number;
  @Prop() custom_class?: string = ''; 
  @Prop() component_mode?: string; 
  @Prop() left_input_id: string;
  @Prop() right_input_id: string;
  @Prop() left_aria_label?: string;
  @Prop() right_aria_label?: string;
  @Prop() left_input_name: string;
  @Prop() right_input_name: string;

  componentWillLoad() {
    this.min_value = this.initial_min;
    this.max_value = this.initial_max;
  }

  handleMinChange(event) {
    const value = Number(event.target.value);
    if (value <= this.max_value - this.step) {
      this.min_value = value;
    }
  }

  handleMaxChange(event) {
    const value = Number(event.target.value);
    if (value >= this.min_value + this.step) {
      this.max_value = value;
    }
  }

  getPercentage(value: number) {
    return ((value - this.min) / (this.max - this.min)) * 100;
  }

  render() {
    return (
      <Host>
        <div class={`dda-range-slider-container dda-tooltip-${this.tooltip_position} ${this.custom_class} ${this.component_mode}`}>
          <div class="dda-range-slider">
            <div class="dda-range-slider-track"
              style={{
                left: `${this.getPercentage(this.min_value)}%`,
                right: `${100 - this.getPercentage(this.max_value)}%`,
              }}>
              <span class="min-label">{this.min_value}%</span>
              <span class="max-label">{this.max_value}%</span>
            </div>
            <label htmlFor={this.left_input_id}>
              <input
                id={this.left_input_id}
                name={this.left_input_name}
                aria-label={this.left_aria_label}
                type="range"
                min={this.min}
                max={this.max}
                step={this.step}
                value={this.min_value}
                onInput={(event) => this.handleMinChange(event)}
                class="dda-range-slider-input"
                style={{ zIndex: `${this.min_value > this.max - this.min_value ? 5 : 3}` }}
              />
            </label>
            <label htmlFor={this.right_input_id}>
              <input
                id={this.right_input_id}
                name={this.right_input_name}
                aria-label={this.right_aria_label}
                type="range"
                min={this.min}
                max={this.max}
                step={this.step}
                value={this.max_value}
                onInput={(event) => this.handleMaxChange(event)}
                class="dda-range-slider-input"
                style={{ zIndex: `${this.max_value < this.max - this.min_value ? 5 : 3}` }}
              />
            </label>
            
          </div>
          
        </div>
      </Host>
    );
  }
}
