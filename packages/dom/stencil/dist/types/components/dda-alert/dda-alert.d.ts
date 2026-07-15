import { EventEmitter } from '../../stencil-public-runtime';
export declare class DdaAlert {
    type: 'primary' | 'secondary';
    variation: 'info' | 'warning' | 'error' | 'success';
    title_text: string;
    description: string;
    button_text: string;
    custom_class?: string;
    component_mode?: string;
    component_id?: string;
    first_link?: string;
    second_link?: string;
    first_button?: string;
    second_button?: string;
    button_name?: string;
    clickHandler?: (event: MouseEvent) => void;
    firstClick?: EventEmitter<void>;
    secondClick?: EventEmitter<void>;
    private firstClickHandler;
    private secondClickHandler;
    render(): any;
}
