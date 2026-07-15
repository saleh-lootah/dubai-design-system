import { Host, Component, h, State, Element } from '@stencil/core';

@Component({
  tag: 'dda-home-banner',
  styleUrls: ['home-banner.css', '../../global/global.css'],
  shadow: false,
})
export class DdaHomeBanner {
  @Element() el: HTMLElement;
  @State() currentSlide: number = 0;
  slides: HTMLElement[] = [];

  componentDidLoad() {
    this.updateSlides();
    // Listen for slot changes
    const slot = this.el.querySelector('slot');
    slot?.addEventListener('slotchange', () => this.updateSlides());
  }

  updateSlides() {
    this.slides = Array.from(this.el.querySelectorAll('slide'));
    if (this.slides.length > 0) {
      this.currentSlide = 0; // Reset slide index if slides are updated
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  setSlide(index) {
    this.currentSlide = index;
  }

  render() {
    return (
      <Host>
        <div class="dda-slider-container">
          <div class="dda-slides" style={{ innerWidth: this.slides.length * 100 + 'vw', left: this.currentSlide * -100 + '%' }}>
            <slot></slot>
          </div>
          <div class={'slider-nav'}>
            <button class="prev" onClick={() => this.prevSlide()}>
              <i class="material-icons">chevron_left</i>
            </button>
            <ul>
              {this.slides.map((_, index) => {
                return <div class={this.currentSlide == index ? 'dots active' : 'dots'} onClick={() => this.setSlide(index)}></div>;
              })}
            </ul>
            <button class="next" onClick={() => this.nextSlide()}>
              <i class="material-icons">chevron_right</i>
            </button>
          </div>
        </div>
      </Host>
    );
  }
}
