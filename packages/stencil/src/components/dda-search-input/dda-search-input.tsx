import { Component, Prop, h, Host, Element } from '@stencil/core';

@Component({
  tag: 'dda-search-input',
  styleUrls: ['../../global/input.css', '../../global/global.css', '../../global/dda-button.css'],
  shadow: false,
})
export class DdaSearchInput {
  /** Placeholder text of the search input. */
  @Prop() placeholder: string = 'Search';
  /** Visible label text, linked to the search input through `input_id`. */
  @Prop() label: string;
  /** Size. `small` shows a smaller field; other values show the default size. */
  @Prop() size: string = 'sm';
  /** Error text shown below the field. When set, the input gets `aria-invalid="true"`. */
  @Prop() error_message: string;
  /** Shows a "Search" button after the clear button. */
  @Prop() show_button: boolean = false;
  /** Helper text shown below the field and linked with `aria-describedby`. */
  @Prop() helper_text: string;
  /** Status style. `disabled` shows the disabled styling only; it does not set the native `disabled` attribute. */
  @Prop() input_status?: string;
  /** Shows the error colors. */
  @Prop() has_error: boolean = false;
  /** Extra CSS classes added to the field container. */
  @Prop() custom_class?: string = ''; 
  /** Theme override class for the field, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  /** `id` of the clear button. */
  @Prop() button_id?: string;
  // F-017: the search <input> needs its own prop-driven id — it previously
  // had a hardcoded id='search', which the visible <label> never targeted
  // (the label pointed at button_id, the clear button's id, instead) and
  // which collided across multiple instances of this component on one page.
  /** `id` of the search input. Also used for the label `for` and the helper and error text ids. */
  @Prop() input_id?: string;
  /** Accessible name of the search input. Use it when there is no visible label. */
  @Prop() aria_label?: string;
  /** Accessible name of the clear button, e.g. `Clear search`. */
  @Prop() button_aria_label?: string;
  /** `name` of the search input, submitted with its form. */
  @Prop() search_input_name: string;
  /** `name` of the clear button. */
  @Prop() close_button_name: string;
  /** `name` of the "Search" button. */
  @Prop() search_button_name: string;

  @Element() el: HTMLElement;

  // F-016: ids derived from the consumer-supplied input_id, same pattern as
  // dda-input/dda-select.
  private get helperId(): string | undefined {
    return this.input_id ? `${this.input_id}-helper` : undefined;
  }

  private get errorId(): string | undefined {
    return this.input_id ? `${this.input_id}-error` : undefined;
  }

  private get describedBy(): string | undefined {
    const ids = [
      this.helper_text ? this.helperId : undefined,
      this.error_message ? this.errorId : undefined,
    ].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
  }

  clearInput() {
    // Was `#search` — the search input's id is now the consumer-supplied
    // input_id (possibly undefined), so target the stable class instead.
    const input = this.el.querySelector('.dda-search-field') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  render() {
    return (
      <Host>
        <div class={`dda-input-container dda-input-size-${this.size} ${this.component_mode} ${this.custom_class}  ${this.input_status ? `dda-input-${this.input_status}` : ''} ${this.has_error ? 'dda-validation-error' : ''}`}>
          {this.label && <label htmlFor={this.input_id} class="dda-input-label">{this.label}</label>}
          <div class="dda-search-area dda-search-action">
            <i class="material-icons icon-left">search</i>
            <input
              name={this.search_input_name}
              aria-label={this.aria_label}
              id={this.input_id}
              type="text"
              class="dda-input-field dda-search-field"
              placeholder={this.placeholder}
              aria-describedby={this.describedBy}
              aria-invalid={this.error_message ? 'true' : undefined}
            />
            <div class="dda-search-btngroup">
              <button name={this.close_button_name} aria-label={this.button_aria_label} id={this.button_id} type="button" class="icon-close" onClick={() => this.clearInput()}><i class="material-icons  material-symbols-outlined">close</i></button>
              {this.show_button && (
                <button name={this.search_button_name} type="button" class="dda-btn btn-color-default-primary dda-btn-sm">Search</button>
              )}
            </div>
          </div>
          {this.helper_text && <span id={this.helperId} class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span id={this.errorId} class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}

