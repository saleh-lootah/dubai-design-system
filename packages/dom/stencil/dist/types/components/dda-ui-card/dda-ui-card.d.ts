import { EventEmitter } from '../../stencil-public-runtime';
export declare class DdaUiCard {
    type: 'default' | 'custom';
    icon: string;
    image: string;
    maintitle: string;
    subtitle: string;
    link: string;
    linktext: string;
    linkicon: string;
    linkClick?: EventEmitter<void>;
    render(): any;
}
