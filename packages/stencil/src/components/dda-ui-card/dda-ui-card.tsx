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
  /** Card title, rendered as an `<h1>`. */
  @Prop() maintitle: string = '';
  /** Muted text shown below the title. */
  @Prop() subtitle: string = '';
  /** URL of the card link. The link shows only when this is set. */
  @Prop() link: string = '';
  /** Text of the card link. */
  @Prop() linktext: string = '';
  /** Material Icons name shown after the link text. Set it to an empty string to hide the icon. */
  @Prop() linkicon: string = 'arrow_forward';
  /** Declared but never emitted by the current version. Listen for the native `click` event on the link instead. */
  @Event() linkClick?: EventEmitter<void>;

  render() {
    return (
      <Host>
        <div class={'dda-card'}>
          <div class={'dda-card-body'}>
            {this.type !== 'custom' && (
              <div>
                {!!this.icon && (
                  <span class={'dda-card-icon'}>
                    <i class={'material-icons'}>{this.icon}</i>
                  </span>
                )}
                {!!this.image && (
                  <span class={'dda-card-icon'}>
                    <img src={this.image} alt={this.maintitle} />
                  </span>
                )}
                {!!this.maintitle && <h1 class={'dda-card-title'}>{this.maintitle}</h1>}
                {!!this.subtitle && <p class={'dda-card-text-muted'}>{this.subtitle}</p>}
                {!!this.link && (
                  <a href={this.link} class={'dda-card-link'}>
                    {this.linktext}{' '}
                    {this.linkicon && (
                      <span>
                        <i class={'material-icons'}>{this.linkicon}</i>
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
