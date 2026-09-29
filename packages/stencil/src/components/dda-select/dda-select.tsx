import { Component, Element, Prop, State, h, Host, Event, EventEmitter, Listen } from '@stencil/core';
import { uniqueId } from '../../utils/unique-id';

/** One option. 5.x string options are read as `{ id: text, text }`. */
export interface SelectOption {
  id: string | number;
  text: string;
}

/** Internal: a parsed option plus, for an object option, the original entry (`source`), so
 * `selectChanged` can emit it with its extra fields, as 3.x did. Never sent on `selectionChange`,
 * and not part of the public `SelectOption` type. */
interface ParsedOption extends SelectOption {
  source?: SelectOption;
}

@Component({
  tag: 'dda-select',
  styleUrls: ['../../global/input.css', '../../global/global.css',],
  shadow: false,
})
export class Ddaselect {
  /** Label shown above the field. The trigger button is named by the label and its current text. */
  @Prop() label: string;
  /** Options: a JSON array, or an array property, of strings (`["Dubai","Sharjah"]`) or 3.x `{ id, text }` objects (`[{"id":1,"text":"Dubai"}]`). Other entries are ignored. Invalid JSON shows "No options available". */
  @Prop() options: string | Array<string | SelectOption>;
  /** The selected option: its id, or its text. For string options the id is the text. Updated to the picked option's id (as a string) when the user picks one. Mutable: the component assigns it. */
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
  /** Text in the trigger when nothing is selected. Default: `Select an option`. */
  @Prop() placeholder: string;
  /** `name` sent in `selectBlurred`. Falls back to `button_id`. */
  @Prop() input_name: string;
  /** 3.x name of `aria_label`, used as the trigger's aria-label only when `label` is not set. `aria_label` wins when both are set; when `label` is set, `main_aria_label` is ignored and the trigger keeps its `aria-labelledby`. */
  @Prop() main_aria_label: string;
  /** 3.x name of `error` (the validation state class). `error` wins when both are set. */
  @Prop() validation_type: string;
  /** Emitted when the user picks an option other than the selected one, by mouse or keyboard. `detail.value` is the new `selected` value (the option id as a string); `detail.id` and `detail.text` are the option. */
  @Event() selectionChange: EventEmitter<{ value: string; id: string | number; text: string }>;
  /** 3.x event: emitted each time the user picks one, even if it is already selected. For a string
   * option this is `{ id, text }`; for an object option this is the original option object, extra
   * fields included, as 3.x did. */
  @Event() selectChanged: EventEmitter<SelectOption>;
  /** 3.x event: emitted when the trigger loses focus, with `{ name, value }` — `input_name` (or `button_id`) and the selected text. */
  @Event() selectBlurred: EventEmitter<{ name: string; value: string }>;

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

  private get parsedOptions(): ParsedOption[] {
    let raw: unknown = this.options;
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw);
      } catch {
        return [];
      }
    }
    if (!Array.isArray(raw)) return [];
    return raw
      .map((entry): ParsedOption | null => {
        if (typeof entry === 'string') return { id: entry, text: entry };
        if (entry && typeof entry === 'object' && typeof (entry as SelectOption).text === 'string') {
          const option = entry as SelectOption;
          // Keep the original entry as `source` so selectChanged can emit it with any extra
          // fields (e.g. `code`) the page passed in, as 3.x did.
          return { id: option.id ?? option.text, text: option.text, source: option };
        }
        return null;
      })
      .filter((option): option is ParsedOption => option !== null);
  }

  // 3.x matched `selected` against the id (as a string) or the text. An id match wins over a
  // text match, so two options with the same text but different ids stay apart.
  private findSelected(options: ParsedOption[]): ParsedOption | undefined {
    if (this.selected === undefined || this.selected === null) return undefined;
    const value = String(this.selected);
    return options.find(option => String(option.id) === value) ?? options.find(option => option.text === value);
  }

  private get selectedOption(): ParsedOption | undefined {
    return this.findSelected(this.parsedOptions);
  }

  private get triggerLabel(): string | undefined {
    if (this.aria_label) return this.aria_label;
    // main_aria_label sets aria-label, which replaces aria-labelledby. Only use it when there is
    // no label to keep aria-labelledby for; otherwise the label and the selected value would stop
    // being announced.
    return this.label ? undefined : this.main_aria_label || undefined;
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
    const selected = this.findSelected(options);
    const index = selected ? options.indexOf(selected) : -1;
    return index >= 0 ? index : 0;
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

  selectOption(option: ParsedOption) {
    if (!this.disabled) {
      const value = String(option.id);
      // Compare against the currently *matched* option's id, not the raw `selected` prop: when
      // `selected` holds text or a differently-typed id (e.g. a number), comparing it to
      // `value` directly reported a change that had not happened.
      const currentSelected = this.findSelected(this.parsedOptions);
      const changed = String(currentSelected?.id) !== value;
      this.selected = value;
      this.closeAndReturnFocus();
      this.selectChanged.emit(option.source ?? { id: option.id, text: option.text });
      if (changed) {
        this.selectionChange.emit({ value, id: option.id, text: option.text });
      }
    }
  }

  private onTriggerBlur = (event: FocusEvent) => {
    // A keyboard ArrowDown/Up on the trigger opens the list and moves focus into it — that is
    // not the user leaving the field, so skip the event when focus lands back inside this.el.
    const related = event.relatedTarget as Node | null;
    if (related && this.el.contains(related)) {
      return;
    }
    this.selectBlurred.emit({
      name: this.input_name || this.button_id || this.triggerId,
      value: this.selectedOption?.text || '',
    });
  };

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

  private onOptionKeyDown = (event: KeyboardEvent, option: SelectOption) => {
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
    const options = this.parsedOptions;
    const current = this.findSelected(options);
    // Computed once here (not per option below) to keep the list render O(n) instead of O(n^2).
    const activeIndex = current ? options.indexOf(current) : 0;
    const validation = this.error || this.validation_type;

    return (
      <Host>
        {/* The open state is dda-select-open, not a bare "show"/"hide": site frameworks style those
            (Bootstrap 3: .hide { display: none !important }) and hid the whole select. */}
        <div
          class={{
            'dda-input-container': true,
            [this.custom_class]: !!this.custom_class,
            [this.component_mode]: !!this.component_mode,
            'dda-input-disabled': this.disabled,
            'dda-select-open': this.is_open,
            [`dda-input-size-${this.size}`]: !!this.size,
            [`dda-validation-${validation}`]: !!validation,
          }}
        >
          {this.label && <label id={this.labelId} class="dda-input-label">{this.label}</label>}
          <div class="dda-dropdown-container">
            <button
              name={this.toggle_button_name}
              aria-label={this.triggerLabel}
              aria-labelledby={this.label && !this.triggerLabel ? `${this.labelId} ${id}` : undefined}
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
              onBlur={this.onTriggerBlur}
            >
              {current ? current.text : (this.placeholder ?? 'Select an option')}
              <i class={`material-icons`} aria-hidden="true">{this.is_open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
            </button>
            {this.is_open && (
              <div id={this.listboxId} role="listbox" aria-label={this.triggerLabel || this.label} class="dda-input-dropdown-list dda-select-list">
                {options.length > 0 ? (
                  options.map((option, index) => {
                    const isCurrent = current !== undefined && String(current.id) === String(option.id);
                    return (
                      <button name={this.option_select_button_name} type="button"
                        role="option"
                        aria-selected={isCurrent ? 'true' : 'false'}
                        tabIndex={index === activeIndex ? 0 : -1}
                        class={`dda-input-dropdown-item ${isCurrent ? 'selected' : ''}`}
                        onClick={() => this.selectOption(option)}
                        onKeyDown={(event) => this.onOptionKeyDown(event, option)}
                        key={`${index}-${option.id}`}
                      >
                        {option.text}
                      </button>
                    );
                  })
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
