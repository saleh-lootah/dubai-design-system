import { Component, Prop, h, Host, Element } from '@stencil/core';

export interface BreadcrumbItem {
  text: string;
  icon?: string;
  url?: string;
}

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
  /** The items, as an array or a JSON string. The `data-breadcrumbs` attribute is still read when this is not set. */
  @Prop() breadcrumbs?: string | BreadcrumbItem[];
  @Element() el: HTMLElement;

  private parseBreadcrumbs(): BreadcrumbItem[] {
    const source = this.breadcrumbs ?? this.el.getAttribute('data-breadcrumbs');
    if (!source) return [];
    if (Array.isArray(source)) return source;
    try {
      const parsed = JSON.parse(source);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  render() {
    const breadcrumbs = this.parseBreadcrumbs();
    return (
      <Host>
        <div class={this.component_mode}>
          <nav aria-label="breadcrumb" class={`${this.custom_class}`}>
            <ol class="dda-breadcrumb">
              {breadcrumbs.map((crumb, index) => (
                <li class={`dda-breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}>
                  <a href={crumb.url}>
                    {this.design !== 'text' && <i class={`material-icons`}>{crumb.icon}</i>}
                    {this.design !== 'icon' && <span>{crumb.text}</span>}
                  </a>
                  {index < breadcrumbs.length - 1 && (
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
