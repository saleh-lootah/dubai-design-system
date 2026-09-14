import { Component, Prop, State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-banner',
  styleUrls: ['dda-banner.css', '../../global/global.css'],
  shadow: true,
})
export class DdaBanner {
  /** Slide images. JSON array of `{ image, title }`; `image` is the image URL and `title` its alternative text. Read once, when the component loads. */
  @Prop() slides: string;
  /** CSS width of each slide image, e.g. `360px`. */
  @Prop() slider_width: string;
  /** CSS height of each slide image, e.g. `220px`. */
  @Prop() slider_height: string;
  /** Accessible name of the scrollable slide region that keyboard users focus to scroll. */
  @Prop() aria_label: string = 'Slides';
  @State() parsedSlides: { image: string; title: string; subtitle: string; link: string }[] = [];

  componentWillLoad() {
    try {
      const slides = JSON.parse(this.slides ?? '[]');
      this.parsedSlides = Array.isArray(slides) ? slides : [];
    } catch {
      this.parsedSlides = [];
    }
  }

  render() {
    return (
      <Host>
        {/* The overflow row is the one tab stop: focusable so arrow keys scroll it (WCAG 2.1.1),
            and named so a screen reader says what it is. Without tabindex, Chrome still made the
            scroller a focus stop on its own, which reported as the host with no visible ring. */}
        <div class={'dda-banner-slider'} tabIndex={0} role="region" aria-label={this.aria_label}>
          {this.parsedSlides.map((slide) => (
            <div class={'dda-banner-slide'}>
              <img src={slide.image} alt={slide.title} style={{ width: this.slider_width, height: this.slider_height }} />
            </div>
          ))}
        </div>
        {/* <slot></slot> */}
      </Host>
    );
  }
}
