export declare class DdaAvatar {
    type: 'photo' | 'icon' | 'text';
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    design: 'default' | 'status' | 'verified' | 'story' | 'notification';
    rounded: 'square' | 'circle';
    src: string;
    icon: string;
    text: string;
    notification_number: number;
    custom_class?: string;
    isOpen: boolean;
    selected: string;
    options: string;
    component_mode?: string;
    aria_label: string;
    button_id?: string;
    button_name?: string;
    toggleDropdown(): void;
    selectOption(option: string): void;
    private get parsedOptions();
    render(): any;
}
