export declare class DdaCreditCardField {
    placeholder: string;
    label: string;
    value: string;
    card_icon: string;
    error_message: string;
    validation_type?: string;
    size?: string;
    input_type?: string;
    helper_text: string;
    disabled: boolean;
    custom_class?: string;
    restrict_input: boolean;
    component_mode?: string;
    input_id: string;
    aria_label?: string;
    input_name?: string;
    formattedValue: string;
    handleInput(event: Event): void;
    formatCardNumber(value: string): void;
    componentWillLoad(): void;
    render(): any;
}
