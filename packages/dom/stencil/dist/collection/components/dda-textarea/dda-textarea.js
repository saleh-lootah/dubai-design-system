import { h, Host } from "@stencil/core";
import Quill from "quill";
import "quill/dist/quill.snow.css";
export class DdaTextarea {
    constructor() {
        this.value = '';
        this.characterCount = 0; // State to track the character count
    }
    componentDidLoad() {
        if (this.enable_rich_editor) {
            const editor = this.el.querySelector('#editor');
            this.quill = new Quill(editor, {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                        ['blockquote', 'code-block'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
                        [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
                        [{ 'direction': 'rtl' }], // text direction
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                        ['clean'], // remove formatting button
                        ['link', 'image', 'video'] // link and image, video
                    ],
                },
                theme: 'snow',
                placeholder: this.placeholder,
            });
            this.quill.on('text-change', () => {
                this.value = this.quill.root.innerHTML;
                this.characterCount = this.quill.getText().length - 1; // Update character count
            });
        }
    }
    handleInput(event) {
        if (!this.enable_rich_editor) {
            this.value = event.target.value;
            this.characterCount = event.target.value.length; // Update character count
        }
    }
    render() {
        const textareaClass = [
            'dda-input-container dda-richtext-editor',
            this.validation_type ? `dda-validation-${this.validation_type}` : '',
            this.input_status ? `dda-input-${this.input_status}` : '',
            this.custom_class, this.component_mode, this.textarea_name,
        ].filter(Boolean).join(' ');
        return (h(Host, { key: 'd0bb6567ab98ba883829d3516d3cf69d82cae7a6' }, h("div", { key: 'a1e08f65edc242579bb57122c67be1b426231b22', class: textareaClass }, this.label && h("label", { key: 'eb8051391170626ded478fed00ddf6a172a0993f', htmlFor: this.input_id, class: "dda-input-label" }, this.label), this.enable_rich_editor ? (h("div", { id: "editor", class: "dda-richeditor-field" })) : (h("textarea", { id: this.input_id, name: this.textarea_name, "aria-label": this.aria_label, placeholder: this.placeholder, value: this.value, onInput: (event) => this.handleInput(event), class: "dda-input-field dda-input-textarea", maxLength: this.max_characters })), this.helper_text && (h("div", { key: 'd5446212e8bea676e7a824f902a7efe898256a92', class: "dda-helper-text" }, h("span", { key: '3206ccc5c6795c6de730d856403394c208fd5e84', class: "dda-flex dda-align-center dda-gap-2" }, h("i", { key: '74b8d3d7e16b0b636b5b4b2c15201c35bc6c17ba', class: "material-icons  material-symbols-outlined" }, "info"), " ", this.helper_text), h("span", { key: '224f922fd07e0a904437049fabbe01d02250f6ff', class: "dda-letter-count" }, this.characterCount, " / ", this.max_characters))), this.error_message && (h("div", { key: '2b8b7eededc81a5be97ea7925ccbe8f21a3e4f42', class: "dda-error-message" }, h("span", { key: 'af58e34909d92f3d454ee137f1758024c695ef29', class: "dda-flex dda-align-center dda-gap-2" }, h("i", { key: '0c1789a75bc703ab07e00da1ff706c60ae13d17e', class: "material-icons  material-symbols-outlined" }, "info"), " ", this.error_message), h("span", { key: '6a8ad00442fe3c132aa8168629c624bed751a58b', class: "dda-letter-count" }, this.characterCount, " / ", this.max_characters))))));
    }
    static get is() { return "dda-textarea"; }
    static get originalStyleUrls() {
        return {
            "$": ["../../global/global.css", "../../global/input.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["../../global/global.css", "../../global/input.css"]
        };
    }
    static get properties() {
        return {
            "placeholder": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "placeholder",
                "reflect": false
            },
            "label": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "label",
                "reflect": false
            },
            "value": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "value",
                "reflect": false,
                "defaultValue": "''"
            },
            "error_message": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "error_message",
                "reflect": false
            },
            "validation_type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "validation_type",
                "reflect": false
            },
            "input_status": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "input_status",
                "reflect": false
            },
            "helper_text": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "helper_text",
                "reflect": false
            },
            "custom_class": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "custom_class",
                "reflect": false
            },
            "enable_rich_editor": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "enable_rich_editor",
                "reflect": false
            },
            "max_characters": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "max_characters",
                "reflect": false
            },
            "component_mode": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "component_mode",
                "reflect": false
            },
            "input_id": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "input_id",
                "reflect": false
            },
            "aria_label": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "aria_label",
                "reflect": false
            },
            "textarea_name": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "textarea_name",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "characterCount": {}
        };
    }
    static get elementRef() { return "el"; }
}
//# sourceMappingURL=dda-textarea.js.map
