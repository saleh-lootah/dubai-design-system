export declare class DdaRangeSlider {
    min: number;
    max: number;
    step: number;
    initial_min: number;
    initial_max: number;
    size?: string;
    tooltip_position?: string;
    min_value: number;
    max_value: number;
    custom_class?: string;
    component_mode?: string;
    left_input_id: string;
    right_input_id: string;
    left_aria_label?: string;
    right_aria_label?: string;
    left_input_name: string;
    right_input_name: string;
    componentWillLoad(): void;
    handleMinChange(event: any): void;
    handleMaxChange(event: any): void;
    getPercentage(value: number): number;
    render(): any;
}
