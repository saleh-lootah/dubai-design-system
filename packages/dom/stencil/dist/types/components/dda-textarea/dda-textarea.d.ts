import 'quill/dist/quill.snow.css';
export declare class DdaTextarea {
    placeholder: string;
    label: string;
    value: string;
    error_message: string;
    validation_type?: string;
    input_status?: string;
    helper_text?: string;
    custom_class?: string;
    enable_rich_editor?: boolean;
    max_characters: number;
    component_mode?: string;
    input_id: string;
    aria_label?: string;
    textarea_name: string;
    el: HTMLElement;
    characterCount: number;
    private quill;
    componentDidLoad(): void;
    handleInput(event: any): void;
    render(): any;
}
