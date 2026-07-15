export declare class DdaBreadcrumb {
    design: 'text' | 'icon-text' | 'icon';
    separator: 'chevron_right' | 'pen_size_2';
    custom_class?: string;
    component_mode?: string;
    el: HTMLElement;
    breadcrumbs: {
        text: string;
        icon: string;
        url: string;
    }[];
    componentWillLoad(): void;
    render(): any;
}
