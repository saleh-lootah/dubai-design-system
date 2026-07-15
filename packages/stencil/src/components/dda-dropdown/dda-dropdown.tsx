import { Component, Prop, State, h, Host } from '@stencil/core';

@Component({
  tag: 'dda-dropdown',
  styleUrls: ['../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaDropdown {
  @Prop() label: string;
  @Prop() options: string; // Receive options as a string
  @Prop() selected: string;
  @Prop() disabled: boolean = false;
  @Prop() error: string;
  @Prop() helper_text: string;
  @Prop() type: 'bg-transparent' | 'bg-white' = 'bg-white';
  @Prop() size: 'small' | 'medium' = 'medium';
  @Prop() icon_mode: boolean = false; // New prop for icon mode
  @Prop() custom_class?: string = ''; 
  @Prop() component_mode?: string; 
  @Prop() button_id: string;
  @Prop() aria_label?: string;
  @Prop() arrow_button_name?: string;
  @Prop() dropdown_button_name?: string;
  
  @State() isopen: boolean = false;

  private get parsedOptions(): string[] {
    try {
      return JSON.parse(this.options);
    } catch {
      return [];
    }
  }

  toggleDropdown() {
    if (!this.disabled) {
      this.isopen = !this.isopen;
    }
  }

  selectOption(option: string) {
    if (!this.disabled) {
      this.selected = option;
      this.isopen = false;
    }
  }

  render() {  
    const containerClass = [
      'dda-input-container dda-inline-flex',
      this.disabled ? 'dda-input-disabled' : '',
      this.size ? `dda-input-size-${this.size}` : '',
      this.custom_class ? `${this.custom_class}` : '',
      this.component_mode,
    ].filter(Boolean).join(' ');

    return (
      <Host>
        <div class={containerClass}>
          {this.label && <label htmlFor={this.button_id} class="dda-input-label">{this.label}</label>}
          <div class={`dda-dropdown-container ${this.type}`}>
            <button id={this.button_id} name={this.arrow_button_name} aria-label={this.aria_label} type="button" class="dda-input-field dda-dropdown-header" onClick={() => this.toggleDropdown()}>
              <i class={`three-dots material-icons`}>{this.isopen ? 'more_vert' : 'more_vert'}</i>
              {!this.icon_mode && <span class="dda-dropdown-text"><span>{this.selected || 'Select an option'}</span> <i class={`material-icons`}>{this.isopen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i></span>
              }
            </button>
            {this.isopen && (
              <div class="dda-input-dropdown-list">
                {this.parsedOptions.length > 0 ? (
                  this.parsedOptions.map(option => (
                    <button type="button" name={this.dropdown_button_name}
                      class={`dda-input-dropdown-item ${this.selected === option ? 'selected' : ''}`}
                      onClick={() => {this.selectOption(option)}}
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
          {this.error && <span class="dda-error-message">{this.error}</span>}
        </div>
      </Host>
    );
  }
}
