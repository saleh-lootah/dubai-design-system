export declare class DdaHorizontalStepper {
    steps: string;
    current_step: number;
    custom_class?: string;
    component_mode?: string;
    parsedSteps: {
        title: string;
        subtitle: string;
        description: string;
    }[];
    componentWillLoad(): void;
    render(): any;
}
