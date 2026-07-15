import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'dda-alert',
  styleUrls: ['dda-alert.css', '../../global/global.css', '../../global/dda-button.css'],
  shadow: false,
})
export class DdaAlert {
  @Prop() type: 'primary' | 'secondary' = 'primary';
  @Prop() variation: 'info' | 'warning' | 'error' | 'success' = 'info';
  @Prop() title_text: string = '';
  @Prop() description: string = '';
  @Prop() button_text: string = '';
  @Prop() custom_class?: string = '';
  @Prop() component_mode?: string;
  @Prop() component_id?: string;
  @Prop() first_link?: string;
  @Prop() second_link?: string;
  @Prop() first_button?: string;
  @Prop() second_button?: string;
  @Prop() button_name?: string;
  @Prop() clickHandler?: (event: MouseEvent) => void;
  @Event() firstClick?: EventEmitter<void>;
  @Event() secondClick?: EventEmitter<void>;

  private firstClickHandler = () => {
    this.firstClick.emit();
  };

  private secondClickHandler = () => {
    this.secondClick.emit();
  };

  render() {
    return (
      <div class={`dda-alert dda-alert-${this.type} dda-alert-${this.variation} ${this.custom_class} ${this.component_mode}`}>
        <i class="material-icons  material-symbols-outlined">info</i>
        <div class="alert-content">
          <h4 class="alert-title">{this.title_text}</h4>
          <p class="alert-description">{this.description}</p>
          <div class="alert-btn-wrap">
            {!!this.first_button && (
              <a href={this.first_link} onClick={() => this.firstClickHandler()}>
                {this.first_button}
              </a>
            )}
            {!!this.second_button && (
              <a href={this.second_link} onClick={() => this.secondClickHandler()}>
                {this.second_button}
              </a>
            )}
          </div>
        </div>
        <button name={this.button_name} class="dda-alert-close" onClick={this.clickHandler}>
          <i class="material-icons  material-symbols-outlined">close</i>
        </button>
      </div>
    );
  }
}
