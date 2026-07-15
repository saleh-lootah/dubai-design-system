export declare class DdaLinkButton {
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
    href?: string;
    component_mode?: string;
    button_id: string;
    render(): any;
}
