export declare class DdaDropdown {
    label: string;
    options: string;
    selected: string;
    disabled: boolean;
    error: string;
    helper_text: string;
    type: 'bg-transparent' | 'bg-white';
    size: 'small' | 'medium';
    icon_mode: boolean;
    custom_class?: string;
    component_mode?: string;
    button_id: string;
    aria_label?: string;
    arrow_button_name?: string;
    dropdown_button_name?: string;
    isopen: boolean;
    private get parsedOptions();
    toggleDropdown(): void;
    selectOption(option: string): void;
    render(): any;
}
