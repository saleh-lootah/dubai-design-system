import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'dda-segmented-tabs',
  styleUrls: ['../../../global/global.css', 'dda-segmented-tabs.css'],
  shadow: false,
})
export class DdaSegmentedTabs {
  @Prop() items: string;
  @Prop() radius_type: string;
  @Prop() custom_class: string;
  @Prop() component_mode?: string;
  @Prop() button_name: string;
  /** Accessible name for the group (applied as aria-label on the group container). */
  @Prop() aria_label: string;
  /** Index of the segment selected by default. Clamped to a valid item index. */
  @Prop() selected_index: number = 0;

  /** F-004 repair: the currently-selected segment. Exactly one segment is
   * selected at a time; this is what makes the component interactive at all. */
  @State() active_index: number = 0;

  /** Emits the newly-selected index whenever the selection changes. */
  @Event() segmentChange: EventEmitter<number>;

  private parsedItems: string[] = [];

  componentWillLoad() {
    this.parsedItems = JSON.parse(this.items);
    this.active_index = this.clampIndex(this.selected_index);
  }

  private clampIndex(index: number): number {
    if (!Array.isArray(this.parsedItems) || this.parsedItems.length === 0) {
      return 0;
    }
    if (typeof index !== 'number' || index < 0 || index >= this.parsedItems.length) {
      return 0;
    }
    return index;
  }

  private selectSegment(index: number) {
    if (index === this.active_index) {
      return;
    }
    this.active_index = index;
    this.segmentChange.emit(index);
  }

  render() {
    return (
      <div
        role="group"
        aria-label={this.aria_label}
        class={`dda-segmented-group ${this.custom_class} ${this.radius_type} ${this.component_mode}`}
      >
        {this.parsedItems.map((item, index) => {
          const isSelected = index === this.active_index;
          const className = `dda-segmented-item${isSelected ? ' active' : ''}`;
          return item.startsWith('fo') ? (
            <button
              name={this.button_name}
              type="button"
              class={className}
              aria-pressed={isSelected ? 'true' : 'false'}
              onClick={() => this.selectSegment(index)}
            >
              <i class="material-icons  material-symbols-outlined">{item}</i>
            </button>
          ) : (
            <button
              name={this.button_name}
              type="button"
              class={className}
              aria-pressed={isSelected ? 'true' : 'false'}
              onClick={() => this.selectSegment(index)}
            >
              {item}
            </button>
          );
        })}
      </div>
    );
  }
}
