import { Component, Prop, h } from '@stencil/core';

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

  private parsedItems: string[] = [];

  componentWillLoad() {
    this.parsedItems = JSON.parse(this.items);
  }

  render() {
    return (  
      <div class={`dda-segmented-group ${this.custom_class} ${this.radius_type} ${this.component_mode}`}>
        {this.parsedItems.map(item => (
          item.startsWith('fo') ? 
            <button name={this.button_name} class="dda-segmented-item"><i class="material-icons  material-symbols-outlined">{item}</i></button> :
            <button name={this.button_name} class="dda-segmented-item">{item}</button>
        ))}
      </div>
    );
  }
}
