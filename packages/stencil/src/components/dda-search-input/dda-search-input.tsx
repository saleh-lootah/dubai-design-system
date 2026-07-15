import { Component, Prop, h, Host, Element } from '@stencil/core';

@Component({
  tag: 'dda-search-input',
  styleUrls: ['../../global/input.css', '../../global/global.css', '../../global/dda-button.css'],
  shadow: false,
})
export class DdaSearchInput {
  @Prop() placeholder: string = 'Search';
  @Prop() label: string;
  @Prop() size: string = 'sm'; // default to small size
  @Prop() error_message: string;
  @Prop() show_button: boolean = false; // control to show/hide search button
  @Prop() helper_text: string;
  @Prop() input_status?: string;
  @Prop() has_error: boolean = false; // control error state
  @Prop() custom_class?: string = ''; 
  @Prop() component_mode?: string; 
  @Prop() button_id?: string;
  @Prop() aria_label?: string;
  @Prop() button_aria_label?: string;
  @Prop() search_input_name: string;
  @Prop() close_button_name: string;
  @Prop() search_button_name: string;

  @Element() el: HTMLElement;

  clearInput() {
    const input = this.el.querySelector('#search') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  render() {
    return (
      <Host>
        <div class={`dda-input-container dda-input-size-${this.size} ${this.component_mode} ${this.custom_class}  ${this.input_status ? `dda-input-${this.input_status}` : ''} ${this.has_error ? 'dda-validation-error' : ''}`}>
          {this.label && <label htmlFor={this.button_id} class="dda-input-label">{this.label}</label>}
          <div class="dda-search-area dda-search-action">
            <i class="material-icons icon-left">search</i>
            <input name={this.search_input_name} aria-label={this.aria_label} id='search' type="text" class="dda-input-field dda-search-field" placeholder={this.placeholder}/>
            <div class="dda-search-btngroup">
              <button name={this.close_button_name} aria-label={this.button_aria_label} id={this.button_id} type="button" class="icon-close" onClick={() => this.clearInput()}><i class="material-icons  material-symbols-outlined">close</i></button>
              {this.show_button && (
                <button name={this.search_button_name} type="button" class="dda-btn btn-color-default-primary dda-btn-sm">Search</button>
              )}
            </div>
          </div>
          {this.helper_text && <span class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}

