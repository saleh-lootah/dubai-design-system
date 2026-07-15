export declare class DdaButton {
    /** Type of button, e.g., "button", "submit" */
    type: string;
    /** Disable the button */
    disabled: boolean;
    /** Icon class for the starting icon */
    start_icon: string;
    end_icon: string;
    aria_label?: string;
    button_color: string;
    size?: string;
    button_shape?: string;
    icon_button_shape?: string;
    gap?: number;
    custom_class?: string;
    component_mode?: string;
    button_id: string;
    button_name?: string;
    /** Function to be called on button click */
    clickHandler?: (event: MouseEvent) => void;
    render(): any;
}
