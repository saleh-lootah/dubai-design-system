import { Component, Prop, State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-accordion',
  styleUrls: ['dda-accordion.css', '../../global/global.css'],
  shadow: false,
})
export class DdaAccordion {
  /** Container style: `bg-border` (filled background with border) or `no-border` (no background or border). */
  @Prop() design: 'bg-border' | 'no-border' = 'bg-border';
  /** Text shown in the header button that opens and closes the panel. */
  @Prop() header_text: string = 'Accordion Header';
  /** Paragraph text shown in the panel when it is open. Slotted content follows it. */
  @Prop() body_description: string = '';
  /** Extra CSS classes added to the accordion container. */
  @Prop() custom_class?: string = '';
  /** Theme override class for the container, e.g. `light-mode`. */
  @Prop() component_mode?: string;
  /** Material Symbols icon name shown before the header text, e.g. `info`. */
  @Prop() accordion_icon: string = 'info';

  @State() isOpen: boolean = false;

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }

  render() {
    return (
      <Host>
        <div class={`accordion-container ${this.design} ${this.custom_class} ${this.component_mode}`}>
          <button type="button" class="accordion-header" onClick={() => this.toggleAccordion()} aria-expanded={this.isOpen ? 'true' : 'false'}>
            {/* <span class="material-symbols-outlined">pen_size_1</span>
<span class="material-symbols-rounded">face</span>
<span class="material-symbols-sharp">face</span> */}
            <div class="header-content">
              <i class="material-icons  material-symbols-outlined" aria-hidden="true">
                {this.accordion_icon}
              </i>
              <span class="header-text">{this.header_text}</span>
            </div>
            <i class={`material-icons arrow-icon`} aria-hidden="true">
              {this.isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </i>
          </button>
          <div class={this.isOpen ? 'accordion-body' : 'dda-d-none'}>
            <p class="body-description">{this.body_description}</p>
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
