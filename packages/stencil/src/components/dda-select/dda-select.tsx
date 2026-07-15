import { Component, Prop, State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-select',
  styleUrls: ['../../global/input.css', '../../global/global.css',],
  shadow: false,
})
export class Ddaselect {
  @Prop() label: string;
  @Prop() options: string; // Receive options as a string
    // @Prop() options: { title: string }[];
  @Prop() selected: string;
  @Prop() disabled: boolean = false;
  @Prop() error?: string;
  @Prop() error_message: string;
  @Prop() helper_text: string;
  @State() is_open: boolean = false;
  @Prop() size?: string;
  //@Prop() validationtype?: string;
  @Prop() custom_class?: string = ''; 
  @Prop() component_mode?: string; 
  @Prop() aria_label?: string;
  @Prop() button_id: string;
  @Prop() toggle_button_name: string;
  @Prop() option_select_button_name: string;

  private get parsedOptions(): string[] {
    try {
      return JSON.parse(this.options);
    } catch {
      return [];
    }
  }

  toggleSelect() {
    if (!this.disabled) {
      this.is_open = !this.is_open;
    }
  }

  selectOption(option: string) {
    if (!this.disabled) {
      this.selected = option;
      this.is_open = false;
    }
  }

  render() {

    
    return (
      <Host>
        <div class={`dda-input-container ${this.custom_class} ${this.component_mode} ${this.disabled ? 'dda-input-disabled' : ''} ${this.is_open ? 'show' : 'hide'} dda-input-size-${this.size} dda-validation-${this.error} `}>
          {this.label && <label htmlFor={this.button_id} class="dda-input-label">{this.label}</label>}
          <div class="dda-dropdown-container">
            <button name={this.toggle_button_name} aria-label={this.aria_label} id={this.button_id} type="button" class="dda-input-field dda-select-header" onClick={() => {this.toggleSelect()}}>
              {this.selected || 'Select an option'}
              <i class={`material-icons`}>{this.is_open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
            </button>
            {this.is_open && (
              <div class="dda-input-dropdown-list dda-select-list">
                {this.parsedOptions.length > 0 ? (
                  this.parsedOptions.map(option => (
                    <button name={this.option_select_button_name} type="button"
                      class={`dda-input-dropdown-item ${this.selected === option ? 'selected' : ''}`}
                      onClick={() => this.selectOption(option)}
                    >
                      {option}
                    </button>
                  ))
                ) : (
                  <div class="dda-input-dropdown-item">No options available</div>
                )}
              </div>
            )}
          </div>
          {this.helper_text && <span class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}
