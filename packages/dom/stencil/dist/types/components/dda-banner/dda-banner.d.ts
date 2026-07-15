export declare class DdaBanner {
    slides: string;
    slider_width: string;
    slider_height: string;
    parsedSlides: {
        image: string;
        title: string;
        subtitle: string;
        link: string;
    }[];
    componentWillLoad(): void;
    render(): any;
}
