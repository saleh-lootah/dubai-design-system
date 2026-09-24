// eslint-disable-next-line @typescript-eslint/no-unused-vars -- h is the Stencil JSX pragma; this repo's eslint config does not recognize it as used (same false positive on every other component file).
import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { parseJsonProp } from '../../utils/parse-json-prop';

export interface BannerCardItem {
  banner_card_href?: string;
  banner_card_url?: string;
  banner_card_id?: string;
  image_src?: string;
  image_alt?: string;
  banner_card_title?: string;
  banner_card_description?: string;
  banner_card_value?: string;
  banner_card_name?: string;
  custom_class?: string;
  component_mode?: string;
}

// The 3.x home-page card row, rebuilt on the .quick-links row in dda.css: the same cards, scroll
// indicators and banner position as plain-HTML quick links. No mouse-driven scrolling, no timers.
@Component({
  tag: 'dda-home-carousel',
  styleUrls: ['../../global/global.css'],
  shadow: false,
})
export class DdaHomeCarousel {
  /** The cards. JSON array, or array property, of `{ banner_card_href, banner_card_title, banner_card_description, image_src, image_alt, banner_card_id, banner_card_value, banner_card_name, custom_class, component_mode }`. */
  @Prop() bannercardlist: string | BannerCardItem[];
  /** Cards shown at once on wide screens. A card is never narrower than 220px. Default: `5`. */
  @Prop() items_in_view: number = 5;
  /** Accessible name of the card list. Default: `Quick links`. */
  @Prop() aria_label: string = 'Quick links';
  /** Extra CSS classes on the list. */
  @Prop() custom_class: string = '';
  /** Theme override class, e.g. `light-mode`. */
  @Prop() component_mode: string;
  /** Emitted when a card is clicked, with its item. A link card still navigates. */
  @Event() cardClick: EventEmitter<BannerCardItem>;

  render() {
    const items = parseJsonProp<BannerCardItem>(this.bannercardlist, 'bannercardlist');
    const perView = Math.max(1, Math.round(Number(this.items_in_view)) || 5);
    const listClass = ['quick-links', 'dda-home-carousel-track', this.custom_class, this.component_mode].filter(Boolean).join(' ');
    return (
      <nav class="dda-home-carousel" aria-label={this.aria_label}>
        <ul class={listClass} style={{ '--dda-home-carousel-per-view': String(perView) }}>
          {items.map((item, index) => (
            <li class="dda-home-carousel-item" key={item.banner_card_id || index}>
              <dda-banner-card
                onClick={() => this.cardClick.emit(item)}
                banner_card_href={item.banner_card_href}
                banner_card_url={item.banner_card_url}
                banner_card_id={item.banner_card_id}
                image_src={item.image_src}
                image_alt={item.image_alt}
                banner_card_title={item.banner_card_title}
                banner_card_description={item.banner_card_description}
                banner_card_value={item.banner_card_value}
                banner_card_name={item.banner_card_name}
                custom_class={item.custom_class || ''}
                component_mode={item.component_mode}
              ></dda-banner-card>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
