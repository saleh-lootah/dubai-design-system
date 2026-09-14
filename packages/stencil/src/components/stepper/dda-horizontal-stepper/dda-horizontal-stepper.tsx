import { Component, Prop,  State, Watch, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-horizontal-stepper',
  styleUrls: ['dda-horizontal-stepper.css', '../../../global/global.css'],
  shadow: false,
})
export class DdaHorizontalStepper {
  /** Steps, as a JSON string array of `{ title, subtitle, description }` objects. */
  @Prop() steps: string;
  /** Index of the active step, from 0. Steps before it show as completed. */
  @Prop() current_step: number = 1;
  /** Extra CSS classes added to the stepper container. */
  @Prop() custom_class?: string; 
  /** Theme override class on the stepper container, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  @State() parsedSteps: { title: string, subtitle: string, description: string }[] = [];

  componentWillLoad() {
    this.parseSteps();
  }

  /** Re-parses `steps` when it changes after load. A missing or invalid value renders no steps. */
  @Watch('steps')
  parseSteps() {
    try {
      const steps = JSON.parse(this.steps ?? '[]');
      this.parsedSteps = Array.isArray(steps) ? steps : [];
    } catch {
      this.parsedSteps = [];
    }
  }

  render() {
    return (
      <Host>
        <div class={`${this.custom_class} ${this.component_mode} h-stepper-container`}>
          {this.parsedSteps.map((step, index) => (
            <div class={`h-step ${index === this.current_step ? 'active' : ''} ${index < this.current_step  ? 'completed' : ''}`}>
              <div class="h-step-indicator">
                <div class="circle"></div>
              </div>
              <div class="h-step-content">
                <div class="h-step-title">{step.title}</div>
                <div class="h-step-subtitle">{step.subtitle}</div>
                <div class="h-step-description">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Host>
    );
  }
}