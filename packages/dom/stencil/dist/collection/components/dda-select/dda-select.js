import { h, Host } from "@stencil/core";
export class Ddaselect {
    constructor() {
        this.disabled = false;
        this.is_open = false;
        //@Prop() validationtype?: string;
        this.custom_class = '';
    }
    get parsedOptions() {
        try {
            return JSON.parse(this.options);
        }
        catch (_a) {
            return [];
        }
    }
    toggleSelect() {
        if (!this.disabled) {
            this.is_open = !this.is_open;
        }
    }
    selectOption(option) {
        if (!this.disabled) {
            this.selected = option;
            this.is_open = false;
        }
    }
    render() {
        return (h(Host, { key: '16d87c733c794f5e09ac0b438583a3e3dcb987d7' }, h("div", { key: '8eb00537f9eb87bbf926c9bc00a2aa674aadcee7', class: `dda-input-container ${this.custom_class} ${this.component_mode} ${this.disabled ? 'dda-input-disabled' : ''} ${this.is_open ? 'show' : 'hide'} dda-input-size-${this.size} dda-validation-${this.error} ` }, this.label && h("label", { key: '54980b7cb2ea1325e3e0561ea6289d92acf47638', htmlFor: this.button_id, class: "dda-input-label" }, this.label), h("div", { key: 'c8df3af01816a60d5af3748d1d161337a6b19ea9', class: "dda-dropdown-container" }, h("button", { key: 'e1028dabaf64ddd8d07dc302293bf993ac402aeb', name: this.toggle_button_name, "aria-label": this.aria_label, id: this.button_id, type: "button", class: "dda-input-field dda-select-header", onClick: () => { this.toggleSelect(); } }, this.selected || 'Select an option', h("i", { key: 'a1fecf6d625cc2e8e430ae65ae8a7e33c18f1cbe', class: `material-icons` }, this.is_open ? 'keyboard_arrow_up' : 'keyboard_arrow_down')), this.is_open && (h("div", { key: '6abd06278d7e14f6924bb4cec2c1ecaa906b5204', class: "dda-input-dropdown-list dda-select-list" }, this.parsedOptions.length > 0 ? (this.parsedOptions.map(option => (h("button", { name: this.option_select_button_name, type: "button", class: `dda-input-dropdown-item ${this.selected === option ? 'selected' : ''}`, onClick: () => this.selectOption(option) }, option)))) : (h("div", { class: "dda-input-dropdown-item" }, "No options available"))))), this.helper_text && h("span", { key: 'ca8e514d1ead7181e814bfef60b70653527d22b0', class: "dda-helper-text" }, this.helper_text), this.error_message && h("span", { key: '2cfc6c8bfadc6f3cf6e3c91eb981dba603075521', class: "dda-error-message" }, this.error_message))));
    }
    static get is() { return "dda-select"; }
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
            "options": {
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
                "attribute": "options",
                "reflect": false
            },
            "selected": {
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
                "attribute": "selected",
                "reflect": false
            },
            "disabled": {
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
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            },
            "error": {
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
                "attribute": "error",
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
            "toggle_button_name": {
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
                "attribute": "toggle_button_name",
                "reflect": false
            },
            "option_select_button_name": {
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
                "attribute": "option_select_button_name",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "is_open": {}
        };
    }
}
//# sourceMappingURL=dda-select.js.map
