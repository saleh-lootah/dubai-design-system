import { Component, Element, Prop, State, h, Host } from '@stencil/core';

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

  @Element() el: HTMLElement;

  // F-014: focus target requested by a keyboard interaction (ArrowDown/Up
  // from the trigger) that fires before the listbox exists in the DOM.
  // Consumed by componentDidRender, then cleared.
  private pendingFocusIndex: number | null = null;

  private get listboxId(): string {
    return `${this.button_id}-listbox`;
  }

  private get parsedOptions(): string[] {
    try {
      return JSON.parse(this.options);
    } catch {
      return [];
    }
  }

  private focusOption(index: number) {
    const options = Array.from(this.el.querySelectorAll<HTMLElement>('.dda-input-dropdown-item[role="option"]'));
    if (options.length === 0) {
      return;
    }
    const clamped = Math.max(0, Math.min(index, options.length - 1));
    options[clamped].focus();
  }

  private currentFocusedOptionIndex(): number {
    const options = Array.from(this.el.querySelectorAll<HTMLElement>('.dda-input-dropdown-item[role="option"]'));
    return options.indexOf(document.activeElement as HTMLElement);
  }

  private initialOptionIndex(): number {
    const options = this.parsedOptions;
    const selectedIndex = options.indexOf(this.selected);
    return selectedIndex >= 0 ? selectedIndex : 0;
  }

  toggleSelect() {
    if (!this.disabled) {
      this.is_open = !this.is_open;
    }
  }

  private closeAndReturnFocus() {
    this.is_open = false;
    const trigger = this.el.querySelector<HTMLElement>('.dda-select-header');
    if (trigger) {
      trigger.focus();
    }
  }

  selectOption(option: string) {
    if (!this.disabled) {
      this.selected = option;
      this.closeAndReturnFocus();
    }
  }

  private onTriggerKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const wasOpen = this.is_open;
      this.is_open = true;
      const target = this.initialOptionIndex();
      if (wasOpen) {
        this.focusOption(target);
      } else {
        this.pendingFocusIndex = target;
      }
    } else if (event.key === 'Escape' && this.is_open) {
      event.preventDefault();
      this.is_open = false;
    }
  };

  private onOptionKeyDown = (event: KeyboardEvent, option: string) => {
    const currentIndex = this.currentFocusedOptionIndex();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusOption(currentIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusOption(currentIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        this.focusOption(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusOption(this.parsedOptions.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectOption(option);
        break;
      case 'Escape':
        event.preventDefault();
        this.closeAndReturnFocus();
        break;
      case 'Tab':
        // Let focus leave naturally; don't trap it, but the popup should
        // not stay open once it does.
        this.is_open = false;
        break;
      default:
        break;
    }
  };

  componentDidRender() {
    if (this.is_open && this.pendingFocusIndex !== null) {
      const target = this.pendingFocusIndex;
      this.pendingFocusIndex = null;
      this.focusOption(target);
    }
  }

  render() {


    return (
      <Host>
        <div class={`dda-input-container ${this.custom_class} ${this.component_mode} ${this.disabled ? 'dda-input-disabled' : ''} ${this.is_open ? 'show' : 'hide'} dda-input-size-${this.size} dda-validation-${this.error} `}>
          {this.label && <label htmlFor={this.button_id} class="dda-input-label">{this.label}</label>}
          <div class="dda-dropdown-container">
            <button
              name={this.toggle_button_name}
              aria-label={this.aria_label}
              id={this.button_id}
              type="button"
              class="dda-input-field dda-select-header"
              aria-haspopup="listbox"
              aria-expanded={this.is_open ? 'true' : 'false'}
              aria-controls={this.is_open ? this.listboxId : undefined}
              onClick={() => {this.toggleSelect()}}
              onKeyDown={this.onTriggerKeyDown}
            >
              {this.selected || 'Select an option'}
              <i class={`material-icons`}>{this.is_open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
            </button>
            {this.is_open && (
              <div id={this.listboxId} role="listbox" aria-label={this.aria_label || this.label} class="dda-input-dropdown-list dda-select-list">
                {this.parsedOptions.length > 0 ? (
                  this.parsedOptions.map((option, index) => (
                    <button name={this.option_select_button_name} type="button"
                      role="option"
                      aria-selected={this.selected === option ? 'true' : 'false'}
                      tabIndex={index === this.initialOptionIndex() ? 0 : -1}
                      class={`dda-input-dropdown-item ${this.selected === option ? 'selected' : ''}`}
                      onClick={() => this.selectOption(option)}
                      onKeyDown={(event) => this.onOptionKeyDown(event, option)}
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
