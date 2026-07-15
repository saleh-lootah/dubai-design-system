declare const _default: {
    title: string;
    tags: string[];
    argTypes: {
        progress: {
            control: string;
            description: string;
            defaultValue: number;
        };
        tooltip: {
            control: string;
            description: string;
            defaultValue: boolean;
        };
        tooltip_position: {
            control: string;
            options: string[];
            description: string;
            defaultValue: string;
        };
        show_percentage_text: {
            control: string;
            description: string;
            defaultValue: boolean;
        };
        custom_class: {
            control: {
                type: string;
            };
            description: string;
        };
        component_mode: {
            control: {
                type: string;
            };
            options: string[];
            description: string;
        };
    };
    parameters: {
        docs: {
            description: {
                component: string;
            };
        };
    };
};
export default _default;
export declare const Default: any;
export declare const WithTooltip: any;
export declare const WithPercentageText: any;
