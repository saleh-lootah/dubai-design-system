import { Host, Component, h, State, Element, Prop, Watch } from '@stencil/core';

const MIN_INTERVAL = 1000;

@Component({
  tag: 'dda-home-banner',
  styleUrls: ['home-banner.css', '../../global/global.css'],
  shadow: false,
})
export class DdaHomeBanner {
  @Element() el: HTMLElement;

  /** Advance through the slides automatically. */
  @Prop() autoplay: boolean = false;

  /** Milliseconds each slide is shown for when `autoplay` is on. Clamped to a 1000ms floor. */
  @Prop() interval: number = 5000;

  /** Accessible name for the carousel region. */
  @Prop() aria_label: string = 'Highlights';

  /** Accessible name for the previous-slide button. */
  @Prop() previous_button_label: string = 'Previous slide';

  /** Accessible name for the next-slide button. */
  @Prop() next_button_label: string = 'Next slide';

  /** Accessible name for the pause button shown while autoplay is running. */
  @Prop() pause_button_label: string = 'Pause slideshow';

  /** Accessible name for the play button shown while autoplay is paused. */
  @Prop() play_button_label: string = 'Play slideshow';

  /** Prefix for each slide dot's accessible name, e.g. "Go to slide 2". */
  @Prop() slide_button_label: string = 'Go to slide';

  /** Template for the screen-reader slide announcement. `{current}` and `{total}` are substituted. */
  @Prop() slide_status_label: string = 'Slide {current} of {total}';

  @State() currentSlide: number = 0;
  @State() slides: HTMLElement[] = [];
  @State() isPaused: boolean = false;
  @State() reducedMotion: boolean = false;

  private timer: ReturnType<typeof setInterval>;
  private observer: MutationObserver;
  private motionQuery: MediaQueryList;
  private isHovered: boolean = false;
  private hasFocusWithin: boolean = false;
  private listening: boolean = false;

  connectedCallback() {
    // Setup lives here, not in componentDidLoad, so that a reparented banner
    // (modal, keep-alive, re-slotting) gets its observer and listeners back.
    if (this.listening) {
      return;
    }
    this.listening = true;

    this.el.addEventListener('mouseenter', this.onMouseEnter);
    this.el.addEventListener('mouseleave', this.onMouseLeave);
    this.el.addEventListener('focusin', this.onFocusIn);
    this.el.addEventListener('focusout', this.onFocusOut);
    // Focusing an offscreen slide makes the browser scroll the overflow:hidden
    // host; that scrollLeft would stack with the `left` offset and skew the track.
    this.el.addEventListener('scroll', this.resetScroll);

    if (typeof window !== 'undefined' && window.matchMedia) {
      this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = this.motionQuery.matches;
      this.motionQuery.addEventListener('change', this.onMotionPreferenceChange);
    }

    // shadow: false means there is no real slot, so `slotchange` never fires —
    // watch the light DOM for added/removed slides instead.
    this.observer = new MutationObserver(() => this.updateSlides());
    this.observer.observe(this.el, { childList: true, subtree: true });

    this.updateSlides();
    this.startAutoplay();
  }

  disconnectedCallback() {
    this.listening = false;
    this.observer?.disconnect();
    this.observer = null;
    this.el.removeEventListener('mouseenter', this.onMouseEnter);
    this.el.removeEventListener('mouseleave', this.onMouseLeave);
    this.el.removeEventListener('focusin', this.onFocusIn);
    this.el.removeEventListener('focusout', this.onFocusOut);
    this.el.removeEventListener('scroll', this.resetScroll);
    this.motionQuery?.removeEventListener('change', this.onMotionPreferenceChange);
    this.isHovered = false;
    this.hasFocusWithin = false;
    this.stopAutoplay();
  }

  componentDidRender() {
    this.syncSlideState();
  }

  @Watch('autoplay')
  @Watch('interval')
  autoplayChanged() {
    this.startAutoplay();
  }

  private onMotionPreferenceChange = (event: MediaQueryListEvent) => {
    this.reducedMotion = event.matches;
    this.startAutoplay();
  };

  private onMouseEnter = () => {
    this.isHovered = true;
    this.stopAutoplay();
  };

  private onMouseLeave = () => {
    this.isHovered = false;
    this.startAutoplay();
  };

  private onFocusIn = () => {
    this.hasFocusWithin = true;
    this.stopAutoplay();
  };

  private onFocusOut = (event: FocusEvent) => {
    // Moving between two controls inside the banner should not resume autoplay.
    if (event.relatedTarget && this.el.contains(event.relatedTarget as Node)) {
      return;
    }
    this.hasFocusWithin = false;
    this.startAutoplay();
  };

  private resetScroll = () => {
    if (this.el.scrollLeft !== 0 || this.el.scrollTop !== 0) {
      this.el.scrollLeft = 0;
      this.el.scrollTop = 0;
    }
  };

  private get isRotating() {
    return this.autoplay && !this.isPaused && !this.reducedMotion;
  }

  private startAutoplay() {
    this.stopAutoplay();
    // WCAG 2.2.2: never move on its own when the user asked for reduced motion,
    // paused the carousel, or is currently reading it with pointer or keyboard.
    if (!this.isRotating || this.isHovered || this.hasFocusWithin) {
      return;
    }
    const delay = Math.max(MIN_INTERVAL, Number(this.interval) || MIN_INTERVAL);
    this.timer = setInterval(() => this.nextSlide(), delay);
  }

  private stopAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private togglePause = () => {
    this.isPaused = !this.isPaused;
    this.startAutoplay();
  };

  /**
   * Hide every slide that is not current from the keyboard and from assistive tech.
   * Attribute writes are not reported by a childList observer, so this cannot loop.
   */
  private syncSlideState() {
    const total = this.slides.length;
    this.slides.forEach((slide, index) => {
      const isCurrent = index === this.currentSlide;
      slide.toggleAttribute('inert', !isCurrent);
      slide.setAttribute('aria-hidden', isCurrent ? 'false' : 'true');
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', this.statusText(index + 1, total));
    });
  }

  private statusText(current: number, total: number) {
    return this.slide_status_label.replace('{current}', String(current)).replace('{total}', String(total));
  }

  updateSlides() {
    const slides = Array.from(this.el.querySelectorAll('slide')) as HTMLElement[];

    // The observer watches this.el, which also contains the nav this component renders,
    // so every re-render re-triggers it. Bail unless the slide list actually changed,
    // otherwise assigning to @State here would loop forever.
    const unchanged = slides.length === this.slides.length && slides.every((s, i) => s === this.slides[i]);
    if (unchanged) {
      return;
    }

    this.slides = slides;
    if (this.currentSlide > slides.length - 1) {
      this.currentSlide = 0;
    }
  }

  nextSlide() {
    if (!this.slides.length) return;
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    if (!this.slides.length) return;
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  setSlide(index) {
    this.currentSlide = index;
  }

  render() {
    const total = this.slides.length;
    const showAutoplayToggle = this.autoplay && !this.reducedMotion;

    return (
      <Host class="home-slider" role="region" aria-roledescription="carousel" aria-label={this.aria_label}>
        <div class="dda-slider-container">
          <div class="dda-slides" style={{ width: total * 100 + 'vw', left: this.currentSlide * -100 + '%' }}>
            <slot></slot>
          </div>
          <div class={'slider-nav'}>
            {showAutoplayToggle && (
              <button class="pause" type="button" aria-label={this.isPaused ? this.play_button_label : this.pause_button_label} onClick={this.togglePause}>
                <i class="material-icons" aria-hidden="true">{this.isPaused ? 'play_arrow' : 'pause'}</i>
              </button>
            )}
            <button class="prev" type="button" aria-label={this.previous_button_label} onClick={() => this.prevSlide()}>
              <i class="material-icons" aria-hidden="true">chevron_left</i>
            </button>
            <ul>
              {this.slides.map((_, index) => {
                const isCurrent = this.currentSlide === index;
                return (
                  <li>
                    <button
                      type="button"
                      class={isCurrent ? 'dots active' : 'dots'}
                      aria-label={`${this.slide_button_label} ${index + 1}`}
                      aria-current={isCurrent ? 'true' : null}
                      onClick={() => this.setSlide(index)}
                    ></button>
                  </li>
                );
              })}
            </ul>
            <button class="next" type="button" aria-label={this.next_button_label} onClick={() => this.nextSlide()}>
              <i class="material-icons" aria-hidden="true">chevron_right</i>
            </button>
          </div>
          {/* Announce manual slide changes. Silent while rotating, so autoplay does not chatter. */}
          <div class="visually-hidden" role="status" aria-live={this.isRotating ? 'off' : 'polite'}>
            {total ? this.statusText(this.currentSlide + 1, total) : ''}
          </div>
        </div>
      </Host>
    );
  }
}
