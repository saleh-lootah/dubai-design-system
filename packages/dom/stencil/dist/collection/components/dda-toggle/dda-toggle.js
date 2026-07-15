import { h, Host } from "@stencil/core";
export class DdaToggle {
    constructor() {
        this.custom_class = '';
    }
    render() {
        const toggleClass = [
            'dda-toggle-btn',
            this.size ? `dda-toggle-${this.size}` : '',
            this.custom_class ? `${this.custom_class}` : '',
            this.component_mode,
        ].filter(Boolean).join(' ');
        return (h(Host, { key: '7ebfcb39353ae8f50f79f9b78de3097fb65361b4' }, h("label", { key: 'a366bdef1ead14eb89703573d75c5fe75d32c4d7', class: toggleClass, htmlFor: this.input_id }, h("input", { key: 'ab49ff4c3901020052bf912412551415679ecae8', "aria-label": this.aria_label, type: "checkbox", id: this.input_id, name: this.group_name, checked: this.checked }), h("span", { key: 'ee11a76eefba9dc2412ca44449d2387f23e878a2', class: "toggle" }), h("p", { key: '4dd252689a00272f64b390331ad7c4886c36e315' }, h("span", { key: 'd281a3380a8e95cf4f79453c67c42815d1dd91bb', class: "toggle-title" }, "Radio Button Title"), h("span", { key: '36f0837980bdb4306aeb2796e1dda458da5a6c97', class: "toggle-supporting" }, "Supporting Text")))));
    }
    static get is() { return "dda-toggle"; }
    static get originalStyleUrls() {
        return {
            "$": ["../../global/global.css", "dda-toggle.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["../../global/global.css", "dda-toggle.css"]
        };
    }
    static get properties() {
        return {
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
                "optional": false,
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
//# sourceMappingURL=dda-toggle.js.map
