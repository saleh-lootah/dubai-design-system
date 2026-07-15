import { Component, Prop, State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-banner',
  styleUrls: ['dda-banner.css', '../../global/global.css'],
  shadow: true,
})
export class DdaBanner {
  @Prop() slides: string; // JSON string of slides;
  @Prop() slider_width: string;
  @Prop() slider_height: string;
  @State() parsedSlides: { image: string; title: string; subtitle: string; link: string }[] = [];

  componentWillLoad() {
    this.parsedSlides = JSON.parse(this.slides);
  }

  render() {
    return (
      <Host>
        <div class={'dda-banner-slider'}>
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
