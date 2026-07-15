export declare class DdaPagination {
    total_pages: number;
    current_page: number;
    type: 'simple-slider' | 'buttons' | 'text' | 'text-pages' | 'button-text' | 'buttons-pages' | 'full';
    custom_class: string;
    component_mode?: string;
    simple_slider_prev_button: string;
    simple_slider_next_button: string;
    buttons_prev_button: string;
    buttons_next_button: string;
    text_prev_button: string;
    text_next_button: string;
    text_pages_prev_button: string;
    text_pages_next_button: string;
    button_text_prev_button: string;
    button_text_next_button: string;
    buttons_pages_prev_button: string;
    buttons_pages_next_button: string;
    validateTotalPages(newValue: number): void;
    validateCurrentPage(newValue: number): void;
    componentWillLoad(): void;
    private renderPagination;
    private renderPageButtons;
    private setcurrentpage;
    render(): any;
}
