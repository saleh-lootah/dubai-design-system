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
  /** What each item shows: `text` (label only), `icon-text` (icon and label) or `icon` (icon only). */
  @Prop() design: 'text' | 'icon-text' | 'icon' = 'text';
  /** Material Symbols icon shown between items: `chevron_right` or `pen_size_2` (a slash). */
  @Prop() separator: 'chevron_right' | 'pen_size_2' = 'chevron_right';
  /** Extra CSS classes added to the inner `<nav>`. */
  @Prop() custom_class?: string = ''; 
  /** Theme override class on the wrapper, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  /** The items, as an array or a JSON string of `{ text, icon?, url? }` objects. The last item is the current page. The `data-breadcrumbs` attribute is still read when this is not set. */
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
