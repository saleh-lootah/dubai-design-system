import { Component, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'dda-avatar',
  styleUrls: ['dda-avatar.css', '../../global/input.css', '../../global/global.css'],
  shadow: false,
})
export class DdaAvatar {
  @Prop() type: 'photo' | 'icon' | 'text' = 'photo';
  @Prop() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = 'md';
  @Prop() design: 'default' | 'status' | 'verified' | 'story' | 'notification' = 'default';
  @Prop() rounded: 'square' | 'circle' = 'circle';
  @Prop() src: string = ''; // For photo type
  @Prop() icon: string = 'material-icons'; // For icon type
  @Prop() text: string = 'AB'; // For text type
  @Prop() notification_number: number = 0; // For notification design
  @Prop() custom_class?: string = ''; 
  @State() isOpen: boolean = false;
  @Prop() selected: string;
  @Prop() options: string;
  @Prop() component_mode?: string; 
  @Prop() aria_label: string;
  @Prop() button_id?: string;
  @Prop() button_name?: string;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    this.selected = option
    this.isOpen = false
  }

  private get parsedOptions(): string[] {
    try {
      return JSON.parse(this.options);
    } catch {
      return [];
    }
  }

  render() {
    return (
      <div onClick={() => this.toggleDropdown()} class={{
        'dda-avatar': true,
        [`avatar-type-${this.type}`]: true,
        [`avatar-size-${this.size}`]: true,
        [`avatar-design-${this.design}`]: true,
        [`avatar-shape-${this.rounded}`]: true,
        [`${this.custom_class}`]: true,
        [`${this.component_mode}`]: true,
        [`${this.button_name}`]: true,
      }}>
      {this.isOpen && (
        <div class="dda-input-dropdown-list">
          {this.parsedOptions.length > 0 ? (
            this.parsedOptions.map(option => (
              <button id={this.button_id} name={this.button_name} aria-label={this.aria_label} type="button"
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
        {this.type === 'photo' && <img src={this.src} alt="Avatar" />}
        {this.type === 'icon' && <i class={`${this.icon} dda-smile`}>sentiment_satisfied</i>}
        {this.type === 'text' && <span class='avatar-main-text'>{this.text}</span>}
        {this.design === 'status' && <div class="status-circle"></div>}
        {this.design === 'verified' && <div class="verified-icon"><span class="material-icons  material-symbols-outlined">verified</span></div>}
        {this.design === 'notification' && <div class="notification-circle">{this.notification_number}</div>}
      </div>
    );
  }
}
