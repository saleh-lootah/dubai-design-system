import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'dda-alert',
  styleUrls: ['dda-alert.css', '../../global/global.css', '../../global/dda-button.css'],
  shadow: false,
})
export class DdaAlert {
  /** Style: `primary` uses a tinted background and border in the variation color; `secondary` uses a neutral surface and border. */
  @Prop() type: 'primary' | 'secondary' = 'primary';
  /** Color and screen reader urgency: `info`, `warning`, `error` or `success`. `error` uses `role="alert"`; the others use `role="status"`. */
  @Prop() variation: 'info' | 'warning' | 'error' | 'success' = 'info';
  /** Heading text of the alert. */
  @Prop() title_text: string = '';
  /** Body text shown below the heading. */
  @Prop() description: string = '';
  /** Not used by the component; nothing is rendered from this value. */
  @Prop() button_text: string = '';
  /** Extra CSS classes added to the alert container. */
  @Prop() custom_class?: string = '';
  /** Theme override class for the alert, e.g. `light-mode`. */
  @Prop() component_mode?: string;
  /** Not used by the component; it is not applied to any element. */
  @Prop() component_id?: string;
  /** `href` of the first action link. */
  @Prop() first_link?: string;
  /** `href` of the second action link. */
  @Prop() second_link?: string;
  /** Label of the first action link. The link shows only when this is set. */
  @Prop() first_button?: string;
  /** Label of the second action link. The link shows only when this is set. */
  @Prop() second_button?: string;
  /** `name` of the close button. */
  @Prop() button_name?: string;
  /** Click handler for the close button, set as a JavaScript property. The alert does not hide itself. */
  @Prop() clickHandler?: (event: MouseEvent) => void;
  /** Accessible name of the close button, read by screen readers instead of the icon ligature. */
  @Prop() close_button_label: string = 'Close';
  /** Heading level (1–6) of the title; pick the level that fits the page outline. */
  @Prop() heading_level: number = 4;
  /** Fires when the first action link is clicked. No detail. */
  @Event() firstClick?: EventEmitter<void>;
  /** Fires when the second action link is clicked. No detail. */
  @Event() secondClick?: EventEmitter<void>;

  private firstClickHandler = () => {
    this.firstClick.emit();
  };

  private secondClickHandler = () => {
    this.secondClick.emit();
  };

  // F-012: no role anywhere meant a screen reader user was never told an
  // alert appeared. `error` is urgent enough to interrupt (role="alert",
  // assertive); the rest are confirmations/notices that should announce
  // politely (role="status") without stealing focus or cutting off speech.
  private get role(): 'alert' | 'status' {
    return this.variation === 'error' ? 'alert' : 'status';
  }

  // The title was always an <h4>, which broke the page heading order.
  // Clamp to a valid heading level; anything unparsable falls back to 4.
  private get headingTag(): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
    const level = Math.round(Number(this.heading_level));
    return `h${Number.isFinite(level) ? Math.min(6, Math.max(1, level)) : 4}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  }

  render() {
    const HeadingTag = this.headingTag;
    return (
      <div role={this.role} class={`dda-alert dda-alert-${this.type} dda-alert-${this.variation} ${this.custom_class} ${this.component_mode}`}>
        <i class="material-icons  material-symbols-outlined" aria-hidden="true">
          info
        </i>
        <div class="alert-content">
          <HeadingTag class="alert-title">{this.title_text}</HeadingTag>
          <p class="alert-description">{this.description}</p>
          <div class="alert-btn-wrap">
            {!!this.first_button && (
              <a href={this.first_link} onClick={() => this.firstClickHandler()}>
                {this.first_button}
              </a>
            )}
            {!!this.second_button && (
              <a href={this.second_link} onClick={() => this.secondClickHandler()}>
                {this.second_button}
              </a>
            )}
          </div>
        </div>
        <button name={this.button_name} class="dda-alert-close" aria-label={this.close_button_label} onClick={this.clickHandler}>
          <i class="material-icons  material-symbols-outlined" aria-hidden="true">
            close
          </i>
        </button>
      </div>
    );
  }
}
