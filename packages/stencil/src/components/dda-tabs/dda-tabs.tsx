import { Component, Prop, State, h, Host, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'dda-tabs',
  styleUrls: ['dda-tabs.css', '../../global/global.css'],
  shadow: false,
})
export class DdaTabs {
  /** Tab content: `text` (label only) or `text-icon` (icon from `tab_icons` before the label). */
  @Prop() type: 'text' | 'text-icon' = 'text';
  /** Style of the active and hovered tab: `dda-tab-default`, `dda-tab-filed`, `dda-tab-underline` or `dda-tab-underline-filled`. */
  @Prop() hover_style: 'dda-tab-default' | 'dda-tab-filed' | 'dda-tab-underline' | 'dda-tab-underline-filled' = 'dda-tab-default';
  /** Not used by the component; it has no effect. */
  @Prop() border_bottom: boolean = false;
  /** Extra CSS classes added to the tab group. */
  @Prop() custom_class?: string = '';
  /** Theme override class on the tab group, e.g. `light-mode`. */
  @Prop() component_mode?: string;
  /** `id` set on every tab button. */
  @Prop() button_id?: string;
  /** Accessible name for the tab group (`aria-label` on the `role="group"` container). */
  @Prop() aria_label: string;
  /** Tab labels, as a JSON string array, e.g. `'["Details", "Documents"]'`. */
  @Prop() tab_texts: string = '["Tab 1", "Tab 2", "Tab 3"]';
  /** Material Icons names, one per tab in the same order, as a JSON string array. Shown when `type` is `text-icon`. */
  @Prop() tab_icons: string = '["sentiment_satisfied", "sentiment_satisfied", "sentiment_satisfied"]';
  /** `name` set on every tab button. */
  @Prop() button_name: string;
  /** Fires when the user clicks a tab. `detail` is the tab index, a number from 0. */
  @Event() tabClick?: EventEmitter<number>;

  private tabhandler = (index: number) => {
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
        {/* F-010: dda-tabs renders no panel and references none (see
            dda-tabs.stories.tsx / dda-tabs-docs.mdx — the consumer owns
            whatever content the tabClick index drives). role="tablist"/
            "tab"/"tabpanel" would announce a tab/tabpanel relationship
            that does not exist, which is worse than no ARIA at all — same
            ruling already applied to dda-segmented-tabs. This is a
            mutually-exclusive toggle-button group instead: role="group"
            with an accessible name, aria-pressed for real state, native
            button keyboard operability. */}
        <div role="group" aria-label={this.aria_label} class={`dda-tabs-container ${this.hover_style} ${this.custom_class} ${this.component_mode}`}>
          {this.parsedTabs.map((title, index) => (
            <button
              id={this.button_id}
              name={this.button_name}
              type="button"
              aria-pressed={this.active_tab === index ? 'true' : 'false'}
              class={`dda-tab-item ${this.active_tab === index ? 'active' : ''}`}
              onClick={() => this.setActiveTab(index)}
            >
              {this.type === 'text-icon' && <i class={`material-icons`} aria-hidden="true">{this.parsedIcons[index] || ""}</i>}
              <span>{title}</span>
            </button>
          ))}
        </div>
      </Host>
    );
  }
}
