import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-credit-card',
  styleUrls: ['dda-credit-card.css', '../../global/global.css'],
  shadow: false,
})
export class DdaCreditCard {
  /** Balance text shown under the fixed "Current Balance" label, e.g. `AED 5,750.20`. */
  @Prop() balance: string;
  /** Card holder name. */
  @Prop() name: string;
  /** Card number. Only the last four characters are shown, after `****`. Required: the card fails to render without it. */
  @Prop() card_number: string;
  /** URL of the card type image (e.g. a card brand logo) shown at the bottom end of the card. */
  @Prop() card_type: string;
  /** Background design: `default`, `green` or `dark`. */
  @Prop() design: string;
  /** Extra CSS classes added to the card container. */
  @Prop() custom_class?: string = '';
  /** Theme override class for the card, e.g. `light-mode`. */
  @Prop() component_mode?: string;

  render() {
    const cardClass = [
      'dda-credit-card-container',
      this.design ? `dda-credit-card-${this.design}` : '',
      this.custom_class ? `${this.custom_class}` : "",
      this.component_mode,
    ].filter(Boolean).join(' ');

    return (
      <Host>
        <div class={cardClass}>
          <div class="dda-credit-card-header">
            <div class="card-balance-info">
              <span class="card-balance-label">Current Balance</span>
              <span class="card-balance">{this.balance}</span>
            </div>
            <i class="material-icons  material-symbols-outlined" aria-hidden="true">wifi</i>
          </div>
          <div class="dda-credit-card-body">
            <div class="card-userinfo">
              <span class="dda-card-name">{this.name}</span>
              <span class="dda-card-number">**** {this.card_number.slice(-4)}</span>
            </div>
            <div><img src={this.card_type} alt="Card Type" class="card-type-icon"/></div>
          </div>
        </div>
      </Host>
    );
  }
}
