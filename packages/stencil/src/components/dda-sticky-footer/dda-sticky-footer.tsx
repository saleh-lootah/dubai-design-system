import { Component, Element, Prop, h, State } from '@stencil/core';

@Component({
  tag: 'dda-sticky-footer',
  styleUrls: ['dda-sticky-footer.css', '../../global/global.css'],
  shadow: false,
})
export class DdaStickyFooter {
  @Element() el: HTMLElement;
  // Left section
  /** Link URL of the happiness icon (left section). */
  @Prop() happinessIconHref: string;
  /** Image URL of the happiness icon. */
  @Prop() happinessIconSrc: string;
  /** Alternative text for the happiness icon. */
  @Prop() happinessIconAlt: string;
  /** Tooltip text of the happiness icon. */
  @Prop() happinessIconTooltip: string;
  /** `id` of the happiness link. */
  @Prop() happinessIconId: string;
  /** Happiness image for `color-theme="dark"`. */
  @Prop() happinessIconSrcDark: string;

  /** Link URL of the accessibility icon, the second icon in the left section. */
  @Prop() accessibilityIconHref: string;
  /** Image URL of the accessibility icon. */
  @Prop() accessibilityIconSrc: string;
  /** Alternative text for the accessibility icon. */
  @Prop() accessibilityIconAlt: string;
  /** Tooltip text of the accessibility icon. */
  @Prop() accessibilityIconTooltip: string;
  /** `id` of the accessibility (04) link. */
  @Prop() accessibilityIconId: string;
  /** Accessibility (04) image for `color-theme="dark"`. */
  @Prop() accessibilityIconSrcDark: string;

  /** Link URL of the services icon (left section). */
  @Prop() servicesIconHref: string;
  /** Image URL of the services icon. */
  @Prop() servicesIconSrc: string;
  /** Alternative text for the services icon. */
  @Prop() servicesIconAlt: string;
  /** Tooltip text of the services icon. */
  @Prop() servicesIconTooltip: string;
  /** Text shown next to the services icon. Nothing is shown when it is not set. */
  @Prop() servicesIconText: string;
  /** `id` of the services link. */
  @Prop() servicesIconId: string;
  /** Services image for `color-theme="dark"`. */
  @Prop() servicesIconSrcDark: string;

  // Middle section
  /** Link URL of the first logo (middle section). */
  @Prop() firstLogoHref: string;
  /** Image URL of the first logo. */
  @Prop() firstLogoSrc: string;
  /** Alternative text for the first logo. */
  @Prop() firstLogoAlt: string;
  /** Tooltip text of the first logo. */
  @Prop() firstLogoTooltip: string;

  /** Link URL of the second logo (middle section). */
  @Prop() secondLogoHref: string;
  /** Image URL of the second logo. */
  @Prop() secondLogoSrc: string;
  /** Alternative text for the second logo. */
  @Prop() secondLogoAlt: string;
  /** Tooltip text of the second logo. */
  @Prop() secondLogoTooltip: string;

  /** Link URL of the third logo (middle section). */
  @Prop() thirdLogoHref: string;
  /** Image URL of the third logo. */
  @Prop() thirdLogoSrc: string;
  /** Alternative text for the third logo. */
  @Prop() thirdLogoAlt: string;
  /** Tooltip text of the third logo. */
  @Prop() thirdLogoTooltip: string;

  // Right section
  /** Link URL of the location icon (right section). */
  @Prop() locationButtonHref: string;
  /** Image URL of the location icon. Takes precedence over `locationButtonIcon`. */
  @Prop() locationLogoSrc: string;
  /** Tooltip text and alternative text of the location icon. */
  @Prop() locationButtonText: string;
  /** Material Symbols icon name of the location link, shown when `locationLogoSrc` is not set. */
  @Prop() locationButtonIcon: string;

  /** Link URL of the news icon (right section). */
  @Prop() newsButtonHref: string;
  /** Image URL of the news icon. Takes precedence over `newsButtonIcon`. */
  @Prop() newsButtonSrc: string;
  /** Tooltip text and alternative text of the news icon. */
  @Prop() newsButtonText: string;
  /** Material Symbols icon name of the news link, shown when `newsButtonSrc` is not set. */
  @Prop() newsButtonIcon: string;

  /** Link URL of the AI assistant icon (right section). */
  @Prop() aiIconHref: string;
  /** Image URL of the AI assistant icon. */
  @Prop() aiIconSrc: string;
  /** Alternative text for the AI assistant icon. */
  @Prop() aiIconAlt: string;
  /** Tooltip text of the AI assistant icon. */
  @Prop() aiIconTooltip: string;
  /** `id` of the AI assistant link. */
  @Prop() aiIconId: string;
  /** AI assistant image for `color-theme="dark"`. */
  @Prop() aiIconSrcDark: string;

  /** Link URL of the chat icon (right section). */
  @Prop() chatIconHref: string;
  /** Image URL of the chat icon. */
  @Prop() chatIconSrc: string;
  /** Alternative text for the chat icon. */
  @Prop() chatIconAlt: string;
  /** Tooltip text of the chat icon. */
  @Prop() chatIconTooltip: string;
  /** `id` of the chat link. */
  @Prop() chatIconId: string;
  /** Chat image for `color-theme="dark"`. */
  @Prop() chatIconSrcDark: string;

  /** `dark` uses the `*-src-dark` images; an image without a dark version keeps its light image. Default: `light`. */
  @Prop() colorTheme: 'light' | 'dark' = 'light';

  /** Accessible name of the bar's `<aside>` landmark. Default: `Quick actions`. */
  @Prop() aria_label: string = 'Quick actions';

  @State() isHidden: boolean = false;
  private lastScrollY: number = 0;

  /** Hides the middle logo section. Default: `false` (the logos show when at least one is set). */
  @Prop() hideMiddleSection: boolean = false;

  componentWillLoad() {
    this.handleScroll = this.handleScroll.bind(this);
  }

  private resizeObserver: ResizeObserver;

  componentDidLoad() {
    window.addEventListener('scroll', this.handleScroll);

    // Publish the bar's height so page layouts fixed above it (.quick-links-wrap) can clear it.
    const bar = this.el.querySelector<HTMLElement>('.dda-footer');
    if (bar && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        document.documentElement.style.setProperty('--dda-sticky-footer-height', `${bar.offsetHeight}px`);
      });
      this.resizeObserver.observe(bar);
    }
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.handleScroll);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    document.documentElement.style.removeProperty('--dda-sticky-footer-height');
  }

  // An image wins when both are set, so pages that set both keep their current look.
  // A Material icon is decorative; the visually hidden text names the link.
  private renderLinkGraphic(src: string, icon: string, text: string) {
    if (src || !icon) {
      return <img src={src} alt={text} />;
    }
    return [
      <i class="material-icons material-symbols-outlined" aria-hidden="true">
        {icon}
      </i>,
      <span class="visually-hidden">{text}</span>,
    ];
  }

  // 3.x: any colorTheme other than "light" is dark. 3.x gave an empty image when the dark one
  // was missing; this falls back to the light image instead.
  private img(light?: string, dark?: string): string | undefined {
    return this.colorTheme !== 'light' && dark ? dark : light;
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    this.isHidden = currentScrollY > this.lastScrollY;
    this.lastScrollY = currentScrollY;
  }

  render() {
    const middleLogos = [
      { href: this.firstLogoHref, src: this.firstLogoSrc, alt: this.firstLogoAlt, tooltip: this.firstLogoTooltip },
      { href: this.secondLogoHref, src: this.secondLogoSrc, alt: this.secondLogoAlt, tooltip: this.secondLogoTooltip },
      { href: this.thirdLogoHref, src: this.thirdLogoSrc, alt: this.thirdLogoAlt, tooltip: this.thirdLogoTooltip },
    ].filter(logo => logo.src);

    return (
      // An <aside>, not a <footer>: the page footer (dda-footer) is the only contentinfo landmark.
      <aside class={{ 'dda-footer': true, hidden: this.isHidden }} aria-label={this.aria_label} aria-hidden={this.isHidden ? 'true' : 'false'} inert={this.isHidden}>
        <div class="footer-content">
          {/* Left Section */}
          <div class="dda-footer-item dda-footer-left">
            <ul>
              {this.happinessIconSrc && (
                <li class="foot-icon-btn">
                  <dda-tooltip title_text={this.happinessIconTooltip} description="" position="top">
                    <a href={this.happinessIconHref} id={this.happinessIconId}>
                      <img src={this.img(this.happinessIconSrc, this.happinessIconSrcDark)} alt={this.happinessIconAlt} />
                    </a>
                  </dda-tooltip>
                </li>
              )}
              {this.accessibilityIconSrc && (
                <li class="foot-icon-btn">
                  <dda-tooltip title_text={this.accessibilityIconTooltip} description="" position="top">
                    <a href={this.accessibilityIconHref} id={this.accessibilityIconId}>
                      <img src={this.img(this.accessibilityIconSrc, this.accessibilityIconSrcDark)} alt={this.accessibilityIconAlt} />
                    </a>
                  </dda-tooltip>
                </li>
              )}
              {(this.servicesIconSrc || this.servicesIconText) && (
                <li class="foot-icon-btn">
                  <dda-tooltip title_text={this.servicesIconTooltip} description="" position="top">
                    <a href={this.servicesIconHref} id={this.servicesIconId}>
                      {/* With visible text the image is decorative; the text names the link. */}
                      <img src={this.img(this.servicesIconSrc, this.servicesIconSrcDark)} alt={this.servicesIconText ? '' : this.servicesIconAlt} />
                      {this.servicesIconText && <span>{this.servicesIconText}</span>}
                    </a>
                  </dda-tooltip>
                </li>
              )}
            </ul>
          </div>

          {/* Middle Section */}
          {!this.hideMiddleSection && middleLogos.length > 0 && (
            <div class="dda-footer-item dda-footer-middle">
              <ul class="foot-logo">
                {middleLogos.map(logo => (
                  <li>
                    <dda-tooltip title_text={logo.tooltip} description="" position="top">
                      <a href={logo.href}>
                        <img src={logo.src} alt={logo.alt} />
                      </a>
                    </dda-tooltip>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Right Section */}
          <div class="dda-footer-item dda-footer-right">
            <ul>
              {(this.locationLogoSrc || this.locationButtonIcon) && (
                <li class="foot-icon-btn">
                  <dda-tooltip title_text={this.locationButtonText} description="" position="top">
                    <a href={this.locationButtonHref}>{this.renderLinkGraphic(this.locationLogoSrc, this.locationButtonIcon, this.locationButtonText)}</a>
                  </dda-tooltip>
                </li>
              )}
              {(this.newsButtonSrc || this.newsButtonIcon) && (
                <li class="foot-icon-btn">
                  <dda-tooltip title_text={this.newsButtonText} description="" position="top">
                    <a href={this.newsButtonHref}>{this.renderLinkGraphic(this.newsButtonSrc, this.newsButtonIcon, this.newsButtonText)}</a>
                  </dda-tooltip>
                </li>
              )}
              {this.aiIconSrc && (
                <li class="foot-icon-btn">
                  <dda-tooltip title_text={this.aiIconTooltip} description="" position="top">
                    <a href={this.aiIconHref} id={this.aiIconId}>
                      <img src={this.img(this.aiIconSrc, this.aiIconSrcDark)} alt={this.aiIconAlt} />
                    </a>
                  </dda-tooltip>
                </li>
              )}
              {this.chatIconSrc && (
                <li class="foot-icon-btn">
                  <dda-tooltip title_text={this.chatIconTooltip} description="" position="top">
                    <a href={this.chatIconHref} id={this.chatIconId}>
                      <img src={this.img(this.chatIconSrc, this.chatIconSrcDark)} alt={this.chatIconAlt} />
                    </a>
                  </dda-tooltip>
                </li>
              )}
            </ul>
          </div>
        </div>
      </aside>
    );
  }
}
