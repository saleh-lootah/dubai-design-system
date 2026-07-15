export declare class Ddaselect {
    label: string;
    options: string;
    selected: string;
    disabled: boolean;
    error?: string;
    error_message: string;
    helper_text: string;
    is_open: boolean;
    size?: string;
    custom_class?: string;
    component_mode?: string;
    aria_label?: string;
    button_id: string;
    toggle_button_name: string;
    option_select_button_name: string;
    private get parsedOptions();
    toggleSelect(): void;
    selectOption(option: string): void;
    render(): any;
}
