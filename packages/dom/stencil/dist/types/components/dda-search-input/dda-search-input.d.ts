export declare class DdaSearchInput {
    placeholder: string;
    label: string;
    size: string;
    error_message: string;
    show_button: boolean;
    helper_text: string;
    input_status?: string;
    has_error: boolean;
    custom_class?: string;
    component_mode?: string;
    button_id?: string;
    aria_label?: string;
    button_aria_label?: string;
    search_input_name: string;
    close_button_name: string;
    search_button_name: string;
    el: HTMLElement;
    clearInput(): void;
    render(): any;
}
