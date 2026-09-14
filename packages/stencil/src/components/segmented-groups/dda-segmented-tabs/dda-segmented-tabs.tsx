import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'dda-segmented-tabs',
  styleUrls: ['../../../global/global.css', 'dda-segmented-tabs.css'],
  shadow: false,
})
export class DdaSegmentedTabs {
  /** Segments, as a JSON string array, e.g. `'["All", "Pending", "Approved"]'`. An item that starts with `fo` renders as a Material Symbols icon name (e.g. `format_align_left`). */
  @Prop() items: string;
  /** Corner shape of the group: `square` or `rounded`. */
  @Prop() radius_type: string;
  /** Extra CSS classes added to the group. */
  @Prop() custom_class: string;
  /** Theme override class on the group, e.g. `light-mode`. */
  @Prop() component_mode?: string;
  /** `name` set on every segment button. */
  @Prop() button_name: string;
  /** Accessible name for the group (applied as aria-label on the group container). */
  @Prop() aria_label: string;
  /** Index of the segment selected on load, from 0. An out-of-range value selects the first segment. */
  @Prop() selected_index: number = 0;
  /** Accessible names for icon-only segments, as a JSON string array in the same order as `items`, e.g. `'["Align left", "Align center"]'`. */
  @Prop() icon_labels?: string;

  /** F-004 repair: the currently-selected segment. Exactly one segment is
   * selected at a time; this is what makes the component interactive at all. */
  @State() active_index: number = 0;

  /** Fires when the user selects a different segment. `detail` is the new index, from 0. */
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

  private get parsedIconLabels(): string[] {
    if (!this.icon_labels) {
      return [];
    }
    try {
      const labels = JSON.parse(this.icon_labels);
      return Array.isArray(labels) ? labels : [];
    } catch (error) {
      console.error('Error parsing icon_labels:', error);
      return [];
    }
  }

  /** Accessible name of an icon-only segment: the matching `icon_labels`
   * entry, else the item text with underscores read as spaces. */
  private iconLabel(item: string, index: number): string {
    const label = this.parsedIconLabels[index];
    return typeof label === 'string' && label.trim() ? label : item.replace(/_/g, ' ');
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
              aria-label={this.iconLabel(item, index)}
              onClick={() => this.selectSegment(index)}
            >
              <i class="material-icons  material-symbols-outlined" aria-hidden="true">{item}</i>
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
