import { Component, Prop, h, State  } from '@stencil/core';

@Component({
  tag: 'dda-sticky-footer',
  styleUrl: 'dda-sticky-footer.css',
//  styleUrls: ['dda-sticky-footer.css', '../../global/global.css'],
  shadow: true,
})
export class DdaStickyFooter {
  /** Left Section Props */
  @Prop() happinessIconHref: string;
  @Prop() happinessIconSrc: string;
  @Prop() happinessIconAlt: string;
  @Prop() happinessIconTooltip: string;

  @Prop() accessibilityIconHref: string;
  @Prop() accessibilityIconSrc: string;
  @Prop() accessibilityIconAlt: string;
  @Prop() accessibilityIconTooltip: string;

  @Prop() servicesIconHref: string;
  @Prop() servicesIconSrc: string;
  @Prop() servicesIconAlt: string;
  @Prop() servicesIconTooltip: string;
  @Prop() servicesIconText: string;

  /** Middle Section Props */
  @Prop() firstLogoHref: string;
  @Prop() firstLogoSrc: string;
  @Prop() firstLogoAlt: string;
  @Prop() firstLogoTooltip: string;

  @Prop() secondLogoHref: string;
  @Prop() secondLogoSrc: string;
  @Prop() secondLogoAlt: string;
  @Prop() secondLogoTooltip: string;

  @Prop() thirdLogoHref: string;
  @Prop() thirdLogoSrc: string;
  @Prop() thirdLogoAlt: string;
  @Prop() thirdLogoTooltip: string;

  /** Right Section Props */
  @Prop() locationButtonHref: string;
  @Prop() locationLogoSrc: string;
  @Prop() locationButtonText: string;
  @Prop() locationButtonIcon: string;

  @Prop() newsButtonHref: string;
  @Prop() newsButtonSrc: string;
  @Prop() newsButtonText: string;
  @Prop() newsButtonIcon: string;

  @Prop() aiIconHref: string;
  @Prop() aiIconSrc: string;
  @Prop() aiIconAlt: string;
  @Prop() aiIconTooltip: string;

  @Prop() chatIconHref: string;
  @Prop() chatIconSrc: string;
  @Prop() chatIconAlt: string;
  @Prop() chatIconTooltip: string;


  @State() isHidden: boolean = false;
  private lastScrollY: number = 0;

  @Prop() hideMiddleSection: boolean;

  componentWillLoad() {
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidLoad() {
    window.addEventListener('scroll', this.handleScroll);
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    this.isHidden = currentScrollY > this.lastScrollY;
    this.lastScrollY = currentScrollY;
  }


  render() {
    return (
      <footer class={{ 'dda-footer': true, 'hidden': this.isHidden }}>
        <div class="footer-content">
          {/* Left Section */}
          <div class="dda-footer-item dda-footer-left">
            <ul>
              <li class="foot-icon-btn">
                <dda-tooltip title_text={this.happinessIconTooltip} description="" position="top">
                  <a href={this.happinessIconHref}>
                    <img src={this.happinessIconSrc} alt={this.happinessIconAlt} />
                  </a>
                </dda-tooltip>
              </li>
              <li class="foot-icon-btn">
                <dda-tooltip title_text={this.accessibilityIconTooltip} description="" position="top">
                  <a href={this.accessibilityIconHref}>
                    <img src={this.accessibilityIconSrc} alt={this.accessibilityIconAlt} />
                  </a>
                </dda-tooltip>
              </li>
              <li class="foot-icon-btn">
                <dda-tooltip title_text={this.servicesIconTooltip} description="" position="top">
                  <a href={this.servicesIconHref}>
                    <img src={this.servicesIconSrc} alt={this.servicesIconAlt} />
                    {this.servicesIconText && <span>{this.servicesIconText}</span>}
                  </a>
                </dda-tooltip>
              </li>
            </ul>
          </div>

          {/* Middle Section */}
          {this.hideMiddleSection == false && (
            <div class="dda-footer-item dda-footer-middle">
            <ul class="foot-logo">
              <li>
                <dda-tooltip title_text={this.firstLogoTooltip} description="" position="top">
                  <a href={this.firstLogoHref}>
                    <img src={this.firstLogoSrc} alt={this.firstLogoAlt} />
                  </a>
                </dda-tooltip>
              </li>
              <li>
                <dda-tooltip title_text={this.secondLogoTooltip} description="" position="top">
                  <a href={this.secondLogoHref}>
                    <img src={this.secondLogoSrc} alt={this.secondLogoAlt} />
                  </a>
                </dda-tooltip>
              </li>
              <li>
                <dda-tooltip title_text={this.thirdLogoTooltip} description="" position="top">
                  <a href={this.thirdLogoHref}>
                    <img src={this.thirdLogoSrc} alt={this.thirdLogoAlt} />
                  </a>
                </dda-tooltip>
              </li>
            </ul>
          </div>
          )}

          {/* Right Section */}
          <div class="dda-footer-item dda-footer-right">
            <ul>
              {/* <li class="foot-menu">
              
              <dda-link-button
                  button_color="onsurface-link"
                  start_icon={this.newsButtonIcon}
                  href={this.newsButtonHref}
                  size="sm"
                >
                  {this.locationButtonText}
                </dda-link-button>
              </li>
              <li class="foot-menu">
                <dda-link-button
                  button_color="onsurface-link"
                  start_icon={this.newsButtonIcon}
                  href={this.newsButtonHref}
                  size="sm"
                >
                  {this.newsButtonText}
                </dda-link-button>
              </li> */}
              <li class="foot-icon-btn">
                <dda-tooltip title_text={this.locationButtonText} description="" position="top">
                  <a href={this.locationButtonHref}>
                    <img src={this.locationLogoSrc} alt={this.locationButtonText} />
                  </a>
                </dda-tooltip>
              </li>
              <li class="foot-icon-btn">
                <dda-tooltip title_text={this.newsButtonText} description="" position="top">
                  <a href={this.newsButtonHref}>
                    <img src={this.newsButtonSrc} alt={this.newsButtonText} />
                  </a>
                </dda-tooltip>
              </li>
              <li class="foot-icon-btn">
                <dda-tooltip title_text={this.aiIconTooltip} description="" position="top">
                  <a href={this.aiIconHref}>
                    <img src={this.aiIconSrc} alt={this.aiIconAlt} />
                  </a>
                </dda-tooltip>
              </li>
              <li class="foot-icon-btn">
                <dda-tooltip title_text={this.chatIconTooltip} description="" position="top">
                  <a href={this.chatIconHref}>
                    <img src={this.chatIconSrc} alt={this.chatIconAlt} />
                  </a>
                </dda-tooltip>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }
}
