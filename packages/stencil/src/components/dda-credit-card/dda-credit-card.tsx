import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-credit-card',
  styleUrls: ['dda-credit-card.css', '../../global/global.css'],
  shadow: false,
})
export class DdaCreditCard {
  @Prop() balance: string;
  @Prop() name: string;
  @Prop() card_number: string;
  @Prop() card_type: string;
  @Prop() design: string;
  @Prop() custom_class?: string = ''; 
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
