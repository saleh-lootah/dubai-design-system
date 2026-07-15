import { Component, Prop, State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-accordion',
  styleUrls: ['dda-accordion.css', '../../global/global.css'],
  shadow: false,
})
export class DdaAccordion {
  @Prop() design: 'bg-border' | 'no-border' = 'bg-border'; // Default to background and border design
  @Prop() header_text: string = 'Accordion Header'; // Default header text
  @Prop() body_description: string = ''; // Default body description
  @Prop() custom_class?: string = '';
  @Prop() component_mode?: string;
  @Prop() accordion_icon: string = 'info'; // Default Material icon

  @State() isOpen: boolean = false;

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  render() {
    return (
      <Host>
        <div class={`accordion-container ${this.design} ${this.custom_class} ${this.component_mode}`}>
          <div class="accordion-header" onClick={() => this.toggleAccordion()}>
            {/* <span class="material-symbols-outlined">pen_size_1</span>
<span class="material-symbols-rounded">face</span>
<span class="material-symbols-sharp">face</span> */}
            <div class="header-content">
              <i class="material-icons  material-symbols-outlined">{this.accordion_icon}</i>
              <span class="header-text">{this.header_text}</span>
            </div>
            <i class={`material-icons arrow-icon`}>{this.isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
          </div>
          <div class={this.isOpen ? 'accordion-body' : 'dda-d-none'}>
            <p class="body-description">{this.body_description}</p>
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
