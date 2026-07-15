export declare class DdaVerticalStepper {
    steps: string;
    current_Step: number;
    custom_class?: string;
    component_mode?: string;
    parsedSteps: {
        icon: string;
        title: string;
        subtitle: string;
        description: string;
    }[];
    componentWillLoad(): void;
    render(): any;
}
