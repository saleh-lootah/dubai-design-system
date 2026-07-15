import { Component, Prop, h, Host, Watch } from '@stencil/core';

@Component({
  tag: 'dda-pagination',
  styleUrls: ['dda-pagination.css', '../../global/global.css'],
  shadow: false,
})
export class DdaPagination {
  @Prop() total_pages: number = 8;
  @Prop() current_page: number = 1;
  @Prop() type: 'simple-slider' | 'buttons' | 'text' | 'text-pages' | 'button-text' | 'buttons-pages' | 'full' = 'simple-slider';
  @Prop() custom_class: string = '';
  @Prop() component_mode?: string; 
  @Prop() simple_slider_prev_button: string;
  @Prop() simple_slider_next_button: string;
  @Prop() buttons_prev_button: string;
  @Prop() buttons_next_button: string;
  @Prop() text_prev_button: string;
  @Prop() text_next_button: string;
  @Prop() text_pages_prev_button: string;
  @Prop() text_pages_next_button: string;
  @Prop() button_text_prev_button: string;
  @Prop() button_text_next_button: string;
  @Prop() buttons_pages_prev_button: string;
  @Prop() buttons_pages_next_button: string;

  @Watch('total_pages')
  validateTotalPages(newValue: number) {
    if (newValue < 1) {
      this.total_pages = 1;
    }
  }

  @Watch('current_page')
  validateCurrentPage(newValue: number) {
    if (newValue < 1) {
      this.current_page = 1;
    } else if (newValue > this.total_pages) {
      this.current_page = this.total_pages;
    }
  }

  componentWillLoad() {
    this.validateTotalPages(this.total_pages);
    this.validateCurrentPage(this.current_page);
  }

  private renderPagination() {
    switch (this.type) {
      case 'simple-slider':
        return (
          <div class={`dda-pagination dda-pagination-simple-slider ${this.custom_class} ${this.component_mode}`}>
            <button name={this.simple_slider_prev_button} class="prev" disabled={this.current_page === 1} onClick={() => this.setcurrentpage(this.current_page - 1)}><i class="material-icons  material-symbols-outlined">arrow_back</i> Prev</button>
            <span>Page {this.current_page} of {this.total_pages}</span>
            <button name={this.simple_slider_next_button} class="next" disabled={this.current_page === this.total_pages} onClick={() => this.setcurrentpage(this.current_page + 1)}>Next <i class="material-icons  material-symbols-outlined">arrow_forward</i></button>
          </div>
        );
      case 'buttons':
        return (
          <div class={`dda-pagination dda-pagination-buttons ${this.custom_class} ${this.component_mode}`}>
            <button name={this.buttons_prev_button} class="prev" disabled={this.current_page === 1} onClick={() => this.setcurrentpage(this.current_page - 1)}><i class="material-icons  material-symbols-outlined">arrow_back</i> Prev</button>
            {this.renderPageButtons()}
            <button name={this.buttons_next_button} class="next" disabled={this.current_page === this.total_pages} onClick={() => this.setcurrentpage(this.current_page + 1)}>Next <i class="material-icons  material-symbols-outlined">arrow_forward</i></button>
          </div>
        );
      case 'text':
        return (
          <div class={`dda-pagination dda-pagination-text ${this.custom_class} ${this.component_mode}`}>
            <button name={this.text_prev_button} class="prev" disabled={this.current_page === 1} onClick={() => this.setcurrentpage(this.current_page - 1)}><i class="material-icons  material-symbols-outlined">arrow_back</i></button>
            <span>Page {this.current_page} of {this.total_pages}</span>
            <button name={this.text_next_button} class="next" disabled={this.current_page === this.total_pages} onClick={() => this.setcurrentpage(this.current_page + 1)}><i class="material-icons  material-symbols-outlined">arrow_forward</i></button>
          </div>
        );
      case 'text-pages':
        return (
          <div class={`dda-pagination dda-pagination-text-pages ${this.custom_class} ${this.component_mode}`}>
            <button name={this.text_pages_prev_button} class="prev" disabled={this.current_page === 1} onClick={() => this.setcurrentpage(this.current_page - 1)}><i class="material-icons  material-symbols-outlined">arrow_back</i></button>
            {this.renderPageButtons()}
            <button name={this.text_pages_next_button} class="next" disabled={this.current_page === this.total_pages} onClick={() => this.setcurrentpage(this.current_page + 1)}><i class="material-icons  material-symbols-outlined">arrow_forward</i></button>
          </div>
        );
      case 'button-text':
        return (
          <div class={`dda-pagination dda-pagination-button-text ${this.custom_class} ${this.component_mode}`}>
            <button name={this.button_text_prev_button} class="prev" disabled={this.current_page === 1} onClick={() => this.setcurrentpage(this.current_page - 1)}><i class="material-icons  material-symbols-outlined">arrow_back</i></button>
            {this.renderPageButtons()}
            <button name={this.button_text_next_button} class="next" disabled={this.current_page === this.total_pages} onClick={() => this.setcurrentpage(this.current_page + 1)}><i class="material-icons  material-symbols-outlined">arrow_forward</i></button>
          </div>
        );
      case 'buttons-pages':
        return (
          <div class={`dda-pagination dda-pagination-buttons-pages ${this.custom_class} ${this.component_mode}`}>
            <button name={this.buttons_pages_prev_button} class="prev" disabled={this.current_page === 1} onClick={() => this.setcurrentpage(this.current_page - 1)}><i class="material-icons  material-symbols-outlined">arrow_back</i></button>
            <button name={this.buttons_pages_next_button} class="next" disabled={this.current_page === this.total_pages} onClick={() => this.setcurrentpage(this.current_page + 1)}><i class="material-icons  material-symbols-outlined">arrow_forward</i></button>
          </div>
        );
      case 'full':
        return (
          <div class={`dda-pagination dda-pagination-full ${this.custom_class} ${this.component_mode}`}>
            {this.renderPageButtons()}
          </div>
        );
    }
  }


  private renderPageButtons() {
    const buttons = [];
    for (let i = 1; i <= this.total_pages; i++) {
      buttons.push(
        <button class={i === this.current_page ? 'active' : ''} onClick={() => this.setcurrentpage(i)}>
          {i}
        </button>
      );
    }
    return buttons;
  }

  private setcurrentpage(page: number) {
    if (page >= 1 && page <= this.total_pages) {
      this.current_page = page;
    }
  }

  render() {
    return (
      <Host>
        <div class={`dda-pagination-container`}>
          {this.renderPagination()}
        </div>
      </Host>
    );
  }
}
