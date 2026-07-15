import { Component, Prop,  State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-horizontal-stepper',
  styleUrls: ['dda-horizontal-stepper.css', '../../../global/global.css'],
  shadow: false,
})
export class DdaHorizontalStepper {
  @Prop() steps: string; // JSON string of steps
  @Prop() current_step: number = 1;
  @Prop() custom_class?: string; 
  @Prop() component_mode?: string; 
  @State() parsedSteps: { title: string, subtitle: string, description: string }[] = [];

  componentWillLoad() {
    this.parsedSteps = JSON.parse(this.steps);
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