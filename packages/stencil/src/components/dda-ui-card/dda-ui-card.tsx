import { Component, Prop, h, Host, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'dda-ui-card',
  styleUrl: 'dda-ui-card.css',
  shadow: false,
})
export class DdaUiCard {
  @Prop() type: 'default' | 'custom' = 'default';
  @Prop() icon: string = '';
  @Prop() image: string = '';
  @Prop() maintitle: string = '';
  @Prop() subtitle: string = '';
  @Prop() link: string = '';
  @Prop() linktext: string = '';
  @Prop() linkicon: string = 'arrow_forward';
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
