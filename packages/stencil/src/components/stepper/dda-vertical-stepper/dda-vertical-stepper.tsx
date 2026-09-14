import { Component, Prop,  State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-vertical-stepper',
  styleUrl: 'dda-vertical-stepper.css',
  shadow: false,
})
export class DdaVerticalStepper {
  /** Steps, as a JSON string array of `{ icon, title, subtitle, description }` objects. `icon` is a Material Icons name. */
  @Prop() steps: string;
  /** Index of the current step, from 0. Steps up to and including it are active. */
  @Prop() current_step?: number;
  /** @deprecated Use `current_step`. Its attribute is `current_-step`, so it never worked in HTML. */
  @Prop() current_Step: number = 0;
  /** Extra CSS classes added to the stepper container. */
  @Prop() custom_class?: string = ''; 
  /** Class added to the stepper container, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  @State() parsedSteps: { icon: string, title: string, subtitle: string, description: string }[] = [];

  componentWillLoad() {
    this.parsedSteps = JSON.parse(this.steps);
  }

  render() {
    const current = this.current_step ?? this.current_Step;
    return (
      <Host>
        <div class={`${this.custom_class} ${this.component_mode} v-stepper-container`}>
          {this.parsedSteps.map((step, index) => (
            <div class={`v-step ${index <= current ? 'active' : ''}`}>
              <div class="v-step-indicator">
                <div class="icon">
                  <i class={`material-icons`}>{step.icon}</i>
                </div>
                {/* {index < this.parsedSteps.length - 1 && <div class="line"></div>} */}
              </div>
              <div class="v-step-content">
                <div class="v-step-title">{step.title}</div>
                <div class="v-step-subtitle">{step.subtitle}</div>
                <div class="v-step-description">{step.description}</div>
              </div>
              <div class="v-step-arrow">
                <i class="material-icons  material-symbols-outlined">chevron_right</i>
              </div>
            </div>
          ))}
        </div>
      </Host>
    );
  }
}