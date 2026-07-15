declare const _default: {
    title: string;
    tags: string[];
    parameters: {
        docs: {
            description: {
                component: string;
            };
        };
    };
    argTypes: {
        title_text: {
            control: string;
            description: string;
        };
        supporting: {
            control: string;
            description: string;
        };
        group_name: {
            control: string;
            description: string;
        };
        labelfor: {
            control: string;
            description: string;
        };
        input_id: {
            control: string;
            description: string;
        };
        checked: {
            control: string;
            description: string;
        };
        size: {
            control: {
                type: string;
            };
            options: string[];
        };
        variants: {
            control: {
                type: string;
            };
            options: string[];
        };
        custom_class: {
            control: {
                type: string;
            };
        };
        component_mode: {
            control: {
                type: string;
            };
            options: string[];
            description: string;
        };
        aria_label: {
            control: {
                type: string;
            };
            description: string;
            radio_status: {
                control: {
                    type: string;
                };
                options: string[];
            };
            onclick: {
                control: {
                    type: string;
                };
                description: string;
            };
        };
    };
};
export default _default;
export declare const DefaultRadio: any;
export declare const CheckedRadio: any;
