import { Component, Prop,  State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-vertical-stepper',
  styleUrl: 'dda-vertical-stepper.css',
  shadow: false,
})
export class DdaVerticalStepper {
  @Prop() steps: string; // JSON string of steps
  @Prop() current_Step: number = 0;
  @Prop() custom_class?: string = ''; 
  @Prop() component_mode?: string; 
  @State() parsedSteps: { icon: string, title: string, subtitle: string, description: string }[] = [];

  componentWillLoad() {
    this.parsedSteps = JSON.parse(this.steps);
  }

  render() {
    return (
      <Host>
        <div class={`${this.custom_class} ${this.component_mode} v-stepper-container`}>
          {this.parsedSteps.map((step, index) => (
            <div class={`v-step ${index <= this.current_Step ? 'active' : ''}`}>
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