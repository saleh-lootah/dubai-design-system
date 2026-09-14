import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'dda-footer',
  styleUrls: ['dda-footer.css', '../../global/global.css'],
  shadow: false,
})
export class DdaFooter {
  /** Heading of the call-to-action area at the top of the footer. */
  @Prop() footerTitle: string;
  /** Heading level (1 to 6) of `footerTitle`, to fit the page's heading order. Default: `4`. */
  @Prop() heading_level: number = 4;
  /** Paragraph under `footerTitle`. */
  @Prop() description: string;
  /** Label of the primary (Sign up) button. The button has no link or action. */
  @Prop() signUpButtonText: string;
  /** Label of the tertiary (Login) button. The button has no link or action. */
  @Prop() loginButtonText: string;
  /** Image URL of the footer logo. */
  @Prop() logoSrc: string;
  /** Alternative text for the footer logo. */
  @Prop() logoAlt: string;
  /** Copyright text in the bottom row. */
  @Prop() copyrightText: string;
  /** Short text shown under the footer logo. Nothing is shown when it is not set. */
  @Prop() logoDescription: string;
  
  // Updated to accept JSON strings
  /** Link columns. JSON array of `{ title, links: [{ label, href }] }`. */
  @Prop() footerSections: string;
  /** Social links in the bottom row. JSON array of `{ href, src, alt }`, where `src` is an image URL. */
  @Prop() socialIcons: string;

  private parseJsonArray(jsonString: string) {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return [];
    }
  }

  render() {
    const sections = this.parseJsonArray(this.footerSections);
    const icons = this.parseJsonArray(this.socialIcons);
    // Clamp to a valid heading element; the classes keep the same look at every level.
    const requestedLevel = Math.round(Number(this.heading_level));
    const level = Number.isNaN(requestedLevel) ? 4 : Math.min(6, Math.max(1, requestedLevel));
    const TitleTag = `h${level}` as any;

    return (
      <footer class="WB-footer">
        <div class="dda-container line-seperater">
          <div class="dda-flex dda-align-center flex-column dda-gap-5">
            <TitleTag class="dda-fs-display-sm dda-fw-700 dda-color-black">{this.footerTitle}</TitleTag>
            <p class="dda-fs-title-sm dda-fw-400 mb-3">{this.description}</p>
            <div class="dda-flex dda-gap-5">
              <dda-button button_color="default-primary" size="lg">
                {this.signUpButtonText}
              </dda-button>
              <dda-button button_color="default-tertiary" size="lg">
                {this.loginButtonText}
              </dda-button>
            </div>
          </div>
        </div>

        <div class="dda-container line-seperater">
          <div class="dda-row">
            <div class="dda-col-lg-4 mb-3">
              <div class="text-center">
                <img class="entt-logo" src={this.logoSrc} alt={this.logoAlt} />
                {this.logoDescription && <p class="dda-fs-title-sm">{this.logoDescription}</p>}
              </div>
            </div>
            <div class="dda-col-lg-8">
              <div class="dda-row">
                {sections.map((section) => (
                  <div class="dda-col-6 dda-col-sm-6 dda-col-md-3 mb-3">
                    <p class="dda-fs-title-sm dda-fw-700 dda-color-black mb-3">{section.title}</p>
                    <ul class="footer-menu">
                      {section.links.map((link) => (
                        <li>
                          <a class="dda-fs-title-sm dda-fw-400" href={link.href}>
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div class="dda-container pt-4">
          <div class="dda-flex dda-align-center dda-justify-space">
            <p class="dda-fs-title-sm">{this.copyrightText}</p>
            <ul class="dda-flex dda-align-center dda-gap-4">
              {icons.map((icon) => (
                <li>
                  <a href={icon.href}>
                    <img class="footer-social-icn" src={icon.src} alt={icon.alt} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    );
  }
}
