export declare class DdaAttachFile {
    label: string;
    helper_text: string;
    error_message: string;
    size?: string;
    validation_type?: string;
    input_type?: string;
    file: File | null;
    custom_class?: string;
    component_mode?: string;
    aria_label?: string;
    button_aria_label?: string;
    input_id: string;
    button_id: string;
    button_name?: string;
    input_name?: string;
    private fileIcons;
    handleFileInput(event: any): void;
    removeFile(): void;
    getFileIcon(fileName: string): any;
    render(): any;
}
