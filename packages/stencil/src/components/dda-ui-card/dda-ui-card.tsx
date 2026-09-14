import { Component, Prop, h, Host, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'dda-ui-card',
  styleUrl: 'dda-ui-card.css',
  shadow: false,
})
export class DdaUiCard {
  /** `default` renders the icon, image, title, subtitle and link from props before the slot; `custom` renders only the slot. */
  @Prop() type: 'default' | 'custom' = 'default';
  /** Material Icons name shown at the top of the card, e.g. `description`. */
  @Prop() icon: string = '';
  /** URL of an image shown at the top of the card. Its alt text is `maintitle`. */
  @Prop() image: string = '';
  /** Card title, rendered as a heading at `heading_level`. */
  @Prop() maintitle: string = '';
  /** Muted text shown below the title. */
  @Prop() subtitle: string = '';
  /** URL of the card link. The link shows only when this is set. */
  @Prop() link: string = '';
  /** Text of the card link. */
  @Prop() linktext: string = '';
  /** Material Icons name shown after the link text. Set it to an empty string to hide the icon. */
  @Prop() linkicon: string = 'arrow_forward';
  /** Heading level (1–6) of the title; pick the level that fits the page outline. */
  @Prop() heading_level: number = 3;
  /** Emitted when the user clicks the card link. `detail` is the original click `MouseEvent`; call `detail.preventDefault()` to stop the navigation. */
  @Event() linkClick?: EventEmitter<MouseEvent>;

  // The title was always an <h1>, so a page of cards had many h1s.
  // Clamp to a valid heading level; anything unparsable falls back to 3.
  private get headingTag(): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
    const level = Math.round(Number(this.heading_level));
    return `h${Number.isFinite(level) ? Math.min(6, Math.max(1, level)) : 3}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  }

  render() {
    const HeadingTag = this.headingTag;
    return (
      <Host>
        <div class={'dda-card'}>
          <div class={'dda-card-body'}>
            {this.type !== 'custom' && (
              <div>
                {!!this.icon && (
                  <span class={'dda-card-icon'}>
                    <i class={'material-icons'} aria-hidden="true">
                      {this.icon}
                    </i>
                  </span>
                )}
                {!!this.image && (
                  <span class={'dda-card-icon'}>
                    <img src={this.image} alt={this.maintitle} />
                  </span>
                )}
                {!!this.maintitle && <HeadingTag class={'dda-card-title'}>{this.maintitle}</HeadingTag>}
                {!!this.subtitle && <p class={'dda-card-text-muted'}>{this.subtitle}</p>}
                {!!this.link && (
                  <a href={this.link} class={'dda-card-link'} onClick={(event: MouseEvent) => this.linkClick.emit(event)}>
                    {this.linktext}{' '}
                    {this.linkicon && (
                      <span>
                        <i class={'material-icons'} aria-hidden="true">
                          {this.linkicon}
                        </i>
                      </span>
                    )}
                  </a>
                )}
              </div>
            )}

            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
