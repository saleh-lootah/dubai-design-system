import { Component, Prop, State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-range-slider',
  styleUrl: 'dda-range-slider.css',
  shadow: false,
})
export class DdaRangeSlider {
  /** Lowest value of the range. */
  @Prop() min: number = 0;
  /** Highest value of the range. */
  @Prop() max: number = 100;
  /** Step between selectable values. */
  @Prop() step: number = 1;
  /** Start value of the lower (left) handle. Read only when the component loads. */
  @Prop() initial_min: number = 0;
  /** Start value of the upper (right) handle. Read only when the component loads. */
  @Prop() initial_max: number = 100;
  /** Not used by the current version; it has no effect. */
  @Prop() size?: string;
  /** Value labels shown as tooltips: `top` or `bottom`. Without it, plain labels show below the track. */
  @Prop() tooltip_position?: string;
  @State() min_value: number;
  @State() max_value: number;
  /** Extra CSS classes added to the slider container. */
  @Prop() custom_class?: string = '';
  /** Theme override class for the slider, e.g. `light-mode`. */
  @Prop() component_mode?: string;
  /** `id` of the lower (left) range input. */
  @Prop() left_input_id: string;
  /** `id` of the upper (right) range input. */
  @Prop() right_input_id: string;
  /** Accessible name of the lower (left) range input, e.g. `Minimum amount`. */
  @Prop() left_aria_label?: string;
  /** Accessible name of the upper (right) range input, e.g. `Maximum amount`. */
  @Prop() right_aria_label?: string;
  /** `name` of the lower (left) range input, submitted with its form. */
  @Prop() left_input_name: string;
  /** `name` of the upper (right) range input, submitted with its form. */
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
