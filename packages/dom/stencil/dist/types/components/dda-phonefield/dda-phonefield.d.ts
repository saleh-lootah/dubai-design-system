export declare class DdaPhoneField {
    label: string;
    placeholder: string;
    helper_text: string;
    validation_type?: string;
    error_message: string;
    disabled: boolean;
    size?: string;
    country_code: string;
    country_flag: string;
    phone_number: string;
    is_focused: boolean;
    dropdown_open: boolean;
    countries: {
        code: string;
        flag: string;
    }[];
    custom_class: string;
    component_mode?: string;
    input_id?: string;
    aria_label: string;
    button_id?: string;
    button_aria_label: string;
    toggle_button_name: string;
    country_select_button_name: string;
    phone_input_name: string;
    componentWillLoad(): void;
    toggleDropdown(): void;
    selectCountry(country: {
        code: string;
        flag: string;
    }): void;
    handleFocus(): void;
    handleBlur(): void;
    handlephonenumberChange(event: Event): void;
    render(): any;
}
