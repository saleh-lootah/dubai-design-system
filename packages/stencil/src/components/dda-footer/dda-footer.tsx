import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'dda-footer',
  styleUrl: 'dda-footer.css',
  shadow: true,
})
export class DdaFooter {
  @Prop() footerTitle: string;
  @Prop() description: string;
  @Prop() signUpButtonText: string;
  @Prop() loginButtonText: string;
  @Prop() logoSrc: string;
  @Prop() logoAlt: string;
  @Prop() copyrightText: string;
  
  // Updated to accept JSON strings
  @Prop() footerSections: string;
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

    return (
      <footer class="WB-footer">
        <div class="dda-container line-seperater">
          <div class="dda-flex dda-align-center flex-column dda-gap-5">
            <h4 class="dda-fs-display-sm dda-fw-700 dda-color-black">{this.footerTitle}</h4>
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
                <p class="dda-fs-title-sm">
                  Design outstanding interfaces with advanced Figma features in a matter of minutes.
                </p>
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
