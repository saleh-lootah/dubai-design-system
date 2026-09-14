import { Component, Prop, State, h, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'dda-avatar',
  styleUrls: ['dda-avatar.css', '../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaAvatar {
  /** Content: `photo` shows the `src` image, `icon` shows a smiley icon, `text` shows `text` as initials. */
  @Prop() type: 'photo' | 'icon' | 'text' = 'photo';
  /** Size: `xs` (24px), `sm` (32px), `md` (40px), `lg` (48px), `xl` (56px) or `xxl` (64px). */
  @Prop() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = 'md';
  /** Badge: `default` (none), `status` (green dot), `verified` (check badge), `notification` (count from `notification_number`). `story` has no style yet. */
  @Prop() design: 'default' | 'status' | 'verified' | 'story' | 'notification' = 'default';
  /** Shape: `circle` or `square` (rounded corners). */
  @Prop() rounded: 'square' | 'circle' = 'circle';
  /** Image URL shown when `type` is `photo`. */
  @Prop() src: string = '';
  /** CSS class of the icon font used when `type` is `icon`, e.g. `material-icons`. The icon glyph is always `sentiment_satisfied`. */
  @Prop() icon: string = 'material-icons';
  /** Initials shown when `type` is `text`. */
  @Prop() text: string = 'AB';
  /** Count shown in the badge when `design` is `notification`. Hidden at sizes `xs` and `sm`. */
  @Prop() notification_number: number = 0;
  /** Extra CSS classes added to the avatar container. */
  @Prop() custom_class?: string = ''; 
  @State() isOpen: boolean = false;
  /** The selected option. Matches one entry of `options`; updated when the user picks an option. Mutable: the component assigns it. */
  @Prop({ mutable: true }) selected: string;
  /** Dropdown options as a JSON array of strings, e.g. `["Profile","Sign out"]`. When set, the avatar becomes a button that opens the list. */
  @Prop() options: string;
  /** Theme override class for the avatar, e.g. `light-mode`. */
  @Prop() component_mode?: string; 
  /** Accessible name of the avatar button and of each option button. The avatar button falls back to `Avatar options`. */
  @Prop() aria_label: string;
  /** `id` applied to each option button in the dropdown. */
  @Prop() button_id?: string;
  /** `name` of each option button in the dropdown. Also added as a CSS class on the avatar container. */
  @Prop() button_name?: string;
  /** Emitted every time the user picks an option from the dropdown, also when it is already selected. `detail.value` is the option. */
  @Event() optionSelect: EventEmitter<{ value: string }>;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    this.selected = option
    this.isOpen = false
    this.optionSelect.emit({ value: option })
  }

  private get parsedOptions(): string[] {
    try {
      return JSON.parse(this.options);
    } catch {
      return [];
    }
  }

  render() {
    const hasOptions = this.parsedOptions.length > 0;
    const avatarContent = [
      this.type === 'photo' && <img src={this.src} alt="Avatar" />,
      this.type === 'icon' && <i class={`${this.icon} dda-smile`}>sentiment_satisfied</i>,
      this.type === 'text' && <span class='avatar-main-text'>{this.text}</span>,
    ];
    return (
      <div class={{
        'dda-avatar': true,
        [`avatar-type-${this.type}`]: true,
        [`avatar-size-${this.size}`]: true,
        [`avatar-design-${this.design}`]: true,
        [`avatar-shape-${this.rounded}`]: true,
        [`${this.custom_class}`]: true,
        [`${this.component_mode}`]: true,
        [`${this.button_name}`]: true,
      }}>
        {hasOptions ? (
          <button
            type="button"
            class="avatar-trigger"
            onClick={() => this.toggleDropdown()}
            aria-expanded={this.isOpen ? 'true' : 'false'}
            aria-label={this.aria_label || 'Avatar options'}
          >
            {avatarContent}
          </button>
        ) : (
          <div class="avatar-trigger">
            {avatarContent}
          </div>
        )}
        {hasOptions && this.isOpen && (
          <div class="dda-input-dropdown-list">
            {this.parsedOptions.map(option => (
              <button id={this.button_id} name={this.button_name} aria-label={this.aria_label} type="button"
                class={`dda-input-dropdown-item ${this.selected === option ? 'selected' : ''}`}
                onClick={() => {this.selectOption(option)}}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {this.design === 'status' && <div class="status-circle"></div>}
        {this.design === 'verified' && <div class="verified-icon"><span class="material-icons  material-symbols-outlined">verified</span></div>}
        {this.design === 'notification' && <div class="notification-circle">{this.notification_number}</div>}
      </div>
    );
  }
}
