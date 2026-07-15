import { EventEmitter } from '../../stencil-public-runtime';
export declare class DdaTabs {
    type: 'text' | 'text-icon';
    hover_style: 'dda-tab-default' | 'dda-tab-filed' | 'dda-tab-underline' | 'dda-tab-underline-filled';
    border_bottom: boolean;
    custom_class?: string;
    component_mode?: string;
    button_id?: string;
    aria_label: string;
    tab_texts: string;
    tab_icons: string;
    button_name: string;
    tabClick?: EventEmitter<void>;
    private tabhandler;
    active_tab: number;
    get parsedTabs(): any;
    get parsedIcons(): any;
    setActiveTab(index: number): void;
    render(): any;
}
