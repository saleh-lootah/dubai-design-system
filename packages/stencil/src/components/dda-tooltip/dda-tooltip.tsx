import { Component, Prop, h, Host, State, Element } from '@stencil/core';

@Component({
  tag: 'dda-tooltip',
  styleUrls: ['../../global/global.css', 'dda-tooltip.css'],
  shadow: false,
})
export class DdaTooltip {
  @Element() el: HTMLElement;

  @Prop() title_text: string;
  @Prop() description: string;
  @Prop() position: 'top' | 'bottom' | 'left' | 'right' = 'top'; // Default to top position
  @Prop() custom_class?: string = '';
  @Prop() component_mode?: string;

  // F-011 (WCAG 1.4.13 dismissible): Escape hides the tooltip without
  // moving the pointer or focus. Losing hover/focus (mouseleave/focusout)
  // resets it so the next hover or focus shows it again, instead of
  // suppressing it permanently.
  @State() dismissed = false;

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.dismissed = true;
    }
  };

  private resetDismissed = () => {
    if (this.dismissed) this.dismissed = false;
  };

  connectedCallback() {
    this.el.addEventListener('keydown', this.handleKeyDown);
    this.el.addEventListener('focusout', this.resetDismissed);
    this.el.addEventListener('mouseleave', this.resetDismissed);
  }

  disconnectedCallback() {
    this.el.removeEventListener('keydown', this.handleKeyDown);
    this.el.removeEventListener('focusout', this.resetDismissed);
    this.el.removeEventListener('mouseleave', this.resetDismissed);
  }

  render() {
    return (
      <Host>
        <div class={`dda-tooltip-container ${this.custom_class} ${this.component_mode} ${this.dismissed ? 'dismissed' : ''}`}>
          <slot></slot>
          <div class={`dda-tooltip-box ${this.position}`}>
            <strong>{this.title_text}</strong>
            <p>{this.description}</p>
          </div>
        </div>
      </Host>
    );
  }
}