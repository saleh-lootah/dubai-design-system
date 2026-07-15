import { h, Host } from "@stencil/core";
export class DdaCheckbox {
    constructor() {
        this.custom_class = '';
    }
    render() {
        const checkboxClass = [
            'dda-checkbox-container',
            this.size ? `dda-checkbox-${this.size}` : '',
            this.style_type ? `dda-checkbox-${this.style_type}` : '',
            this.custom_class ? this.custom_class : '',
            this.checkbox_status ? `dda-checkbox-${this.checkbox_status}` : '',
            this.component_mode,
        ].filter(Boolean).join(' ');
        return (h(Host, { key: 'b3d87ce1d9d302aa097b1d5b7c2d1a3a071806b4' }, h("div", { key: '47f3fc5fe414121ca5fa6343e67d5126c48de298', class: checkboxClass }, h("input", { key: 'a1238882628f5bc6851844ea5067012146808155', "aria-label": this.aria_label, type: "checkbox", id: this.input_id, name: this.group_name, checked: this.checked }), h("label", { key: 'c70f2628a1894d6a41780839579ab83bf047536a', htmlFor: this.input_id }, h("i", { key: 'a99c593823941380467c1508b76f1087594ddaf1', class: "material-icons  material-symbols-outlined" }, "check"), h("p", { key: 'c30f6a4b007f4a8638403cebc0578361b77896a9' }, h("span", { key: '1c21da52037d3e7a02b430a0a53fd3b46cccb830', class: "dda-checkbox-title" }, this.title_text), this.supporting && h("span", { key: 'ff5ac17e5b73dc19cbe8ada080fe3194388cbf2d', class: "dda-checkbox-supporting" }, this.supporting))))));
    }
    static get is() { return "dda-checkbox"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-checkbox.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-checkbox.css", "../../global/global.css"]
        };
    }
    static get properties() {
        return {
            "title_text": {
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
                "attribute": "title_text",
                "reflect": false
            },
            "supporting": {
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
                "attribute": "supporting",
                "reflect": false
            },
            "group_name": {
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
                "attribute": "group_name",
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
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "input_id",
                "reflect": false
            },
            "checked": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
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
                "attribute": "checked",
                "reflect": false
            },
            "checkbox_status": {
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
                "attribute": "checkbox_status",
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
            "style_type": {
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
                "attribute": "style_type",
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
                "reflect": false
            }
        };
    }
}
//# sourceMappingURL=dda-checkbox.js.map
