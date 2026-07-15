import { h, Host } from "@stencil/core";
import pdfIcon from "../../assets/img/icn/icn-PDF.svg";
import pptIcon from "../../assets/img/icn/icn-PowerPoint.svg";
import wordIcon from "../../assets/img/icn/icn-Word.svg";
import excelIcon from "../../assets/img/icn/icn-Excel.svg";
import imageIcon from "../../assets/img/icn/icn-Image.svg";
import videoIcon from "../../assets/img/icn/icn-Video.svg";
import onenoteIcon from "../../assets/img/icn/icn-OneNote.svg";
export class DdaAttachFile {
    constructor() {
        this.file = null;
        this.custom_class = '';
        this.aria_label = '';
        this.button_aria_label = '';
        this.fileIcons = {
            pdf: pdfIcon,
            pptx: pptIcon,
            docx: wordIcon,
            xlsx: excelIcon,
            png: imageIcon,
            jpg: imageIcon,
            jpeg: imageIcon,
            mp4: videoIcon,
            mkv: videoIcon,
            one: onenoteIcon,
        };
    }
    handleFileInput(event) {
        const files = event.target.files;
        if (files.length > 0) {
            this.file = files[0];
        }
        else {
            this.file = null;
        }
    }
    removeFile() {
        this.file = null;
    }
    getFileIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        return this.fileIcons[extension] || 'path/to/default-icon.png';
    }
    render() {
        const inputClass = [
            'dda-input-container',
            this.validation_type ? `dda-validation-${this.validation_type}` : '',
            this.size ? `dda-input-size-${this.size}` : '',
            this.input_type ? `dda-input-${this.input_type}` : '',
            this.custom_class,
            this.component_mode,
        ].filter(Boolean).join(' ');
        return (h(Host, { key: '2d326e6771361dfadbf74acf3e1da7c4c01081a1' }, h("div", { key: '73ee87b968a71714962a5c1c827423b38e226f96', class: inputClass }, this.label && h("label", { key: 'c2289d6796ef5b18a15d4231dba867d77d749054', htmlFor: this.input_id, class: "dda-input-label" }, this.label), h("div", { key: '3628674f8eb1587c614b1273518af16f9220b44b', class: "dda-input-field-group dda-attach-file" }, this.file ? (h("div", { class: "dda-file-details" }, h("div", { class: "dda-items" }, h("img", { src: this.getFileIcon(this.file.name), alt: "File Icon", class: "dda-file-icon" }), h("span", { class: "dda-file-name" }, this.file.name)), h("button", { id: this.button_id, name: this.button_name, "aria-label": this.button_aria_label, class: "remove-file", onClick: () => this.removeFile() }, h("i", { class: "material-icons  material-symbols-outlined", "aria-hidden": "true" }, "close")))) : (h("div", { class: "dda-file-input" }, h("span", null, "No File Selected"), h("label", { htmlFor: this.input_id, class: "dda-file-choose" }, "Choose File", h("input", { id: this.input_id, name: this.input_name, "aria-label": this.aria_label, type: "file", onInput: (event) => { this.handleFileInput(event); } }))))), this.helper_text && h("span", { key: 'bdb80b60498a1ce38933fff0db1416d40306d4b2', class: "dda-helper-text" }, this.helper_text), this.error_message && h("span", { key: 'd667368f488c7e0142e440c38d412b5cc5cf5406', class: "dda-error-message" }, this.error_message))));
    }
    static get is() { return "dda-attach-file"; }
    static get originalStyleUrls() {
        return {
            "$": ["../../global/input.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["../../global/input.css", "../../global/global.css"]
        };
    }
    static get properties() {
        return {
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
            "helper_text": {
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
                "attribute": "helper_text",
                "reflect": false
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
            "size": {
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
                "attribute": "size",
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
            "input_type": {
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
                "attribute": "input_type",
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
                "reflect": false,
                "defaultValue": "''"
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
                "reflect": false,
                "defaultValue": "''"
            },
            "button_aria_label": {
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
                "attribute": "button_aria_label",
                "reflect": false,
                "defaultValue": "''"
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
            "button_id": {
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
                "attribute": "button_id",
                "reflect": false
            },
            "button_name": {
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
                "attribute": "button_name",
                "reflect": false
            },
            "input_name": {
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
                "attribute": "input_name",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "file": {}
        };
    }
}
//# sourceMappingURL=dda-attach-file.js.map
