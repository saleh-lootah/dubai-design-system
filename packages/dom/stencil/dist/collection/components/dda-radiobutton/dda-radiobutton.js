import { h, Host } from "@stencil/core";
export class DdaRadiobutton {
    constructor() {
        this.custom_class = '';
    }
    render() {
        const radiobuttonClass = [
            'dda-radio-container',
            this.size ? `dda-radio-${this.size}` : '',
            this.variants ? `dda-radio-${this.variants}` : '',
            this.custom_class ? `dda-radio-${this.custom_class}` : '',
            this.radio_status ? `dda-radio-${this.radio_status}` : '',
            this.component_mode,
        ].filter(Boolean).join(' ');
        return (h(Host, { key: '368b91ce677e0115d91b328ab2871d0cc812005e' }, h("div", { key: '496e814487a4e8f9700aef053e6f3accb5b91bdd', class: radiobuttonClass }, h("input", { key: '83d28b4d2cfba195250738daac53cde23d0cc736', "aria-label": this.aria_label, type: "radio", id: this.input_id, name: this.group_name, checked: this.checked }), h("label", { key: 'f2f21adcb545dda8e7bddc1cf621c31f65349f1c', htmlFor: this.input_id }, h("span", { key: '2c1f04f1232b86eaa87b46aaeb6534a0e4531684', class: "radio-circle" }), h("p", { key: 'd06ff0fdafb23cccefa87c8476060fe24e8ff3f5' }, h("span", { key: '2e78565d9415a4568071975331adce51347019dc', class: "radio-title" }, this.title_text), this.supporting && h("span", { key: 'a3f324650f867069037f3a647eed18e49e1f447f', class: "radio-supporting" }, this.supporting))))));
    }
    static get is() { return "dda-radiobutton"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-radiobutton.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-radiobutton.css"]
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
            "radio_status": {
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
                "attribute": "radio_status",
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
            "variants": {
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
                "attribute": "variants",
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
//# sourceMappingURL=dda-radiobutton.js.map
