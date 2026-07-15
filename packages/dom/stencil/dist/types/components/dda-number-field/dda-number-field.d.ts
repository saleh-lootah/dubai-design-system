export declare class DdaNumberField {
    placeholder: string;
    label: string;
    value: string;
    helper_text: string;
    error_message: string;
    validation_type?: string;
    size?: string;
    input_status?: string;
    currencies: string;
    selected_currency: string;
    is_focused: boolean;
    custom_class?: string;
    component_mode?: string;
    input_id: string;
    aria_label?: string;
    input_name?: string;
    toggle_button_name?: string;
    currency_button_name?: string;
    isCurrencyDropdownOpen: boolean;
    handleInput(event: any): void;
    handleFocus(): void;
    handleBlur(): void;
    toggleCurrencyDropdown(): void;
    selectCurrency(currency: string): void;
    private get parsedCurrencies();
    render(): any;
}
