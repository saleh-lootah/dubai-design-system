import { Component, Prop, State, h, Host, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'dda-tabs',
  styleUrls: ['dda-tabs.css', '../../global/global.css'],
  shadow: false,
})
export class DdaTabs {
  @Prop() type: 'text' | 'text-icon' = 'text';
  @Prop() hover_style: 'dda-tab-default' | 'dda-tab-filed' | 'dda-tab-underline' | 'dda-tab-underline-filled' = 'dda-tab-default';
  @Prop() border_bottom: boolean = false;
  @Prop() custom_class?: string = '';
  @Prop() component_mode?: string;
  @Prop() button_id?: string;
  @Prop() aria_label: string;
  @Prop() tab_texts: string = '["Tab 1", "Tab 2", "Tab 3"]'; // Keep it as a string
  @Prop() tab_icons: string = '["sentiment_satisfied", "sentiment_satisfied", "sentiment_satisfied"]';
  @Prop() button_name: string;
  @Event() tabClick?: EventEmitter<void>;

  private tabhandler = (index) => {
    this.tabClick.emit(index);
  };

  @State() active_tab: number = 0;

  // Parse the stringified array to an actual array
  get parsedTabs() {
    try {
      return JSON.parse(this.tab_texts); // Parse the string into an array
    } catch (error) {
      console.error("Error parsing tab_texts:", error);
      return ['Tab 1', 'Tab 2', 'Tab 3']; // Fallback to default
    }
  }

  get parsedIcons() {
    try {
      return JSON.parse(this.tab_icons); // Parse the string into an array
    } catch (error) {
      console.error("Error parsing tabicons:", error);
      return ["sentiment_satisfied", "sentiment_satisfied", "sentiment_satisfied"]; // Fallback to default
    }
  }

  setActiveTab(index: number) {
    this.active_tab = index;
    if (this.tabClick) {
      this.tabhandler(index);
    }
  }

  render() {
    return (
      <Host>
        <div class={`dda-tabs-container ${this.hover_style} ${this.custom_class} ${this.component_mode}`}>
          {this.parsedTabs.map((title, index) => (
            <button
              id={this.button_id}
              name={this.button_name}
              aria-label={this.aria_label}
              type="button"
              class={`dda-tab-item ${this.active_tab === index ? 'active' : ''}`}
              onClick={() => this.setActiveTab(index)}
            >
              {this.type === 'text-icon' && <i class={`material-icons`}>{this.parsedIcons[index] || ""}</i>}
              <span>{title}</span>
            </button>
          ))}
        </div>
      </Host>
    );
  }
}
