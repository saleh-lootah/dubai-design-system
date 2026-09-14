import { Component, Element, Prop, State, h, Host, Event, EventEmitter, Listen } from '@stencil/core';
import { uniqueId } from '../../utils/unique-id';

@Component({
  tag: 'dda-select',
  styleUrls: ['../../global/input.css', '../../global/global.css',],
  shadow: false,
})
export class Ddaselect {
  /** Label shown above the field. The trigger button is named by the label and its current text. */
  @Prop() label: string;
  /** Options as a JSON array string, e.g. `'["Dubai","Abu Dhabi","Sharjah"]'`. Invalid JSON shows "No options available". */
  @Prop() options: string;
    // @Prop() options: { title: string }[];
  /** The selected option. Must match an entry in `options`. The trigger shows "Select an option" when it is empty. Updated when the user picks an option. Mutable: the component assigns it. */
  @Prop({ mutable: true }) selected: string;
  /** Disables the select: the list does not open and options cannot be picked. */
  @Prop() disabled: boolean = false;
  /** Validation state. `error` shows the error styling. */
  @Prop() error?: string;
  /** Error text shown under the field. Also sets `aria-invalid` on the trigger. */
  @Prop() error_message: string;
  /** Helper text shown under the field. */
  @Prop() helper_text: string;
  @State() is_open: boolean = false;
  /** Field size. `small` gives the compact field; leave empty for the default size. */
  @Prop() size?: string;
  //@Prop() validationtype?: string;
  /** Extra CSS classes added to the field container. */
  @Prop() custom_class?: string = '';
  /** Theme override class for the field, e.g. `light-mode`. */
  @Prop() component_mode?: string;
  /** Accessible name of the trigger button and the option list. The list falls back to `label`. */
  @Prop() aria_label?: string;
  /** `id` of the trigger button. Also used to build the ids of the label, list, helper text and error message, so keep it unique. When it is not set, the component generates a unique id. */
  @Prop() button_id: string;
  /** `name` of the trigger button. */
  @Prop() toggle_button_name: string;
  /** `name` of each option button in the list. */
  @Prop() option_select_button_name: string;
  /** Emitted when the user picks an option other than the selected one, by mouse or keyboard. `detail.value` is the new option. */
  @Event() selectionChange: EventEmitter<{ value: string }>;

  @Element() el: HTMLElement;

  // F-014: focus target requested by a keyboard interaction (ArrowDown/Up
  // from the trigger) that fires before the listbox exists in the DOM.
  // Consumed by componentDidRender, then cleared.
  private pendingFocusIndex: number | null = null;

  // Fallback id so the label, list and messages are wired when no button_id
  // is passed (otherwise ids became "undefined-listbox" and the label had for="").
  private readonly fallbackId = uniqueId('dda-select');

  private get triggerId(): string {
    return this.button_id || this.fallbackId;
  }

  private get labelId(): string {
    return `${this.triggerId}-label`;
  }

  private get listboxId(): string {
    return `${this.triggerId}-listbox`;
  }

  // F-016: same trigger-id-derived uniqueness pattern as listboxId above.
  private get helperId(): string {
    return `${this.triggerId}-helper`;
  }

  private get errorId(): string {
    return `${this.triggerId}-error`;
  }

  private get describedBy(): string | undefined {
    const ids = [
      this.helper_text ? this.helperId : undefined,
      this.error_message ? this.errorId : undefined,
    ].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
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

  // The label has no `for`: label[for] on a <button> replaces the button text
  // as its name, so the selected value was not announced. A click on the label
  // still acts on the trigger, like a native label click did.
  @Listen('click')
  onHostClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target || typeof target.closest !== 'function' || !target.closest('label.dda-input-label')) {
      return;
    }
    const trigger = this.el.querySelector<HTMLElement>('.dda-select-header');
    if (trigger) {
      trigger.focus();
    }
    this.toggleSelect();
  }

  selectOption(option: string) {
    if (!this.disabled) {
      const changed = this.selected !== option;
      this.selected = option;
      this.closeAndReturnFocus();
      if (changed) {
        this.selectionChange.emit({ value: option });
      }
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
    const id = this.triggerId;

    return (
      <Host>
        <div class={`dda-input-container ${this.custom_class} ${this.component_mode} ${this.disabled ? 'dda-input-disabled' : ''} ${this.is_open ? 'show' : 'hide'} dda-input-size-${this.size} dda-validation-${this.error} `}>
          {this.label && <label id={this.labelId} class="dda-input-label">{this.label}</label>}
          <div class="dda-dropdown-container">
            <button
              name={this.toggle_button_name}
              aria-label={this.aria_label}
              aria-labelledby={this.label && !this.aria_label ? `${this.labelId} ${id}` : undefined}
              id={id}
              type="button"
              class="dda-input-field dda-select-header"
              aria-haspopup="listbox"
              aria-expanded={this.is_open ? 'true' : 'false'}
              aria-controls={this.is_open ? this.listboxId : undefined}
              aria-describedby={this.describedBy}
              aria-invalid={this.error_message ? 'true' : undefined}
              onClick={() => {this.toggleSelect()}}
              onKeyDown={this.onTriggerKeyDown}
            >
              {this.selected || 'Select an option'}
              <i class={`material-icons`} aria-hidden="true">{this.is_open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
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
          {this.helper_text && <span id={this.helperId} class="dda-helper-text">{this.helper_text}</span>}
          {this.error_message && <span id={this.errorId} class="dda-error-message">{this.error_message}</span>}
        </div>
      </Host>
    );
  }
}
