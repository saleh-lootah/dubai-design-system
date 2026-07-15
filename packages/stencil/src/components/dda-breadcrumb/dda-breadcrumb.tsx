import { Component, Prop, h, Host, Element } from '@stencil/core';

@Component({
  tag: 'dda-breadcrumb',
  styleUrls: ['dda-breadcrumb.css', '../../global/global.css'],
  shadow: false,
})
export class DdaBreadcrumb {
  @Prop() design: 'text' | 'icon-text' | 'icon' = 'text'; // Default to text design
  @Prop() separator: 'chevron_right' | 'pen_size_2' = 'chevron_right'; // Default to chevron separator
  @Prop() custom_class?: string = ''; 
  @Prop() component_mode?: string; 
  @Element() el: HTMLElement;

  breadcrumbs: { text: string; icon: string; url: string }[] = [];

  componentWillLoad() {
    const breadcrumbsData = this.el.getAttribute('data-breadcrumbs');
    if (breadcrumbsData) {
      this.breadcrumbs = JSON.parse(breadcrumbsData);
    }
  }

  render() {
    return (
      <Host>
        <div class={this.component_mode}>
          <nav aria-label="breadcrumb" class={`${this.custom_class}`}>
            <ol class="dda-breadcrumb">
              {this.breadcrumbs && this.breadcrumbs.map((crumb, index) => (
                <li class={`dda-breadcrumb-item ${index === this.breadcrumbs.length - 1 ? 'active' : ''}`}>
                  <a href={crumb.url}>
                    {this.design !== 'text' && <i class={`material-icons`}>{crumb.icon}</i>}
                    {this.design !== 'icon' && <span>{crumb.text}</span>}
                  </a>
                  {index < this.breadcrumbs.length - 1 && (
                    <i class={`material-icons material-symbols-outlined`}>{this.separator}</i>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </Host>
    );
  }
}
