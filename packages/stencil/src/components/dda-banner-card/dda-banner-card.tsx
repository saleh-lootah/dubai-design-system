import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'dda-banner-card',
  styleUrls: ['../../global/global.css'],
  shadow: false,
})
export class DdaBannerCard {
  /** Link URL. With a URL the card is a link; without one it is a button. */
  @Prop() banner_card_href: string;
  /** 3.x name of `banner_card_href`. `banner_card_href` wins when both are set. */
  @Prop() banner_card_url: string;
  /** `id` of the link or button. */
  @Prop() banner_card_id: string;
  /** Icon image URL. The icon is decorative: the title names the card. */
  @Prop() image_src: string;
  /** Kept for 3.x markup. The icon is decorative, so this text is not read. */
  @Prop() image_alt: string;
  /** Title of the card; it is the accessible name. */
  @Prop() banner_card_title: string;
  /** Text under the title. An empty value shows nothing. */
  @Prop() banner_card_description: string;
  /** `value` of the button (cards without a URL). */
  @Prop() banner_card_value: string;
  /** `name` of the button (cards without a URL). */
  @Prop() banner_card_name: string;
  /** Extra CSS classes. */
  @Prop() custom_class: string = '';
  /** Theme override class, e.g. `light-mode`. */
  @Prop() component_mode: string;

  render() {
    const href = this.banner_card_href || this.banner_card_url;
    const className = ['link-item', 'dda-banner-card', this.custom_class, this.component_mode].filter(Boolean).join(' ');
    const content = [
      this.image_src && <img class="dda-banner-card-icon" src={this.image_src} alt="" aria-hidden="true" />,
      <span class="title">{this.banner_card_title}</span>,
      this.banner_card_description && <span class="subtitle">{this.banner_card_description}</span>,
    ];
    return href ? (
      <a id={this.banner_card_id} class={className} href={href}>
        {content}
      </a>
    ) : (
      <button id={this.banner_card_id} class={className} type="button" name={this.banner_card_name} value={this.banner_card_value}>
        {content}
      </button>
    );
  }
}
