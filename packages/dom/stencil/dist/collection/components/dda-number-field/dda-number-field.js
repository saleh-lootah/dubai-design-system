import { h, Host } from "@stencil/core";
export class DdaNumberField {
    constructor() {
        this.selected_currency = 'USD';
        this.is_focused = false;
        this.custom_class = '';
        this.isCurrencyDropdownOpen = false;
    }
    handleInput(event) {
        const inputElement = event.target;
        const inputValue = inputElement.value.replace(/[^0-9.]/g, '');
        inputElement.value = inputValue;
    }
    handleFocus() {
        this.is_focused = true;
    }
    handleBlur() {
        this.is_focused = false;
    }
    toggleCurrencyDropdown() {
        this.isCurrencyDropdownOpen = !this.isCurrencyDropdownOpen;
        this.handleFocus();
        this.handleBlur();
    }
    selectCurrency(currency) {
        this.selected_currency = currency;
        this.isCurrencyDropdownOpen = false;
    }
    get parsedCurrencies() {
        try {
            return JSON.parse(this.currencies);
        }
        catch (_a) {
            return [];
        }
    }
    render() {
        const containerClass = [
            'dda-input-container',
            this.validation_type ? `dda-validation-${this.validation_type}` : '',
            this.size ? `dda-input-size-${this.size}` : '',
            this.input_status ? `dda-input-${this.input_status}` : '',
            this.is_focused ? 'dda-input-focus' : '',
            this.error_message ? 'dda-error-message' : '',
            this.custom_class ? `${this.custom_class}` : '',
            this.component_mode,
        ].filter(Boolean).join(' ');
        return (h(Host, { key: 'c4d0c6d67ffc76e1a892806c8dfed1b82255e7a3' }, h("div", { key: '5a7034827824ae84e82512cefb63dac5773818f1', class: containerClass }, this.label && h("label", { key: 'c49b784b589e4443ccdf741076d01424e89aa7c9', htmlFor: this.input_id, class: "dda-input-label" }, this.label), h("div", { key: '095a3c3162af18b881220a5d1299f38a85e2d14c', class: "dda-input-field-group dda-number-field" }, h("input", { key: '061e363c131de379650476fd6f082e06b11a48df', id: this.input_id, name: this.input_name, "aria-label": this.aria_label, type: "text", placeholder: this.placeholder, value: this.value, pattern: "[0-9]*", onInput: event => this.handleInput(event), onFocus: this.handleFocus.bind(this), onBlur: this.handleBlur.bind(this), class: "dda-field-group-input" }), h("div", { key: '11026a1dc2fcfe3305799c886aab0283ff7d388c', class: "dda-input-dropdown-btn" }, h("button", { key: '7a68f5b43f86d5886448c865770e0ebdc33986bd', name: this.toggle_button_name, type: "button", class: "dda-dropdown-select", onClick: () => this.toggleCurrencyDropdown() }, this.selected_currency, " ", h("i", { key: 'b74994d63866de1e6aaf0da0fe91cb4c6f15c425', class: `material-icons` }, this.isCurrencyDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down')), this.isCurrencyDropdownOpen && (h("div", { key: '4b3c5a7ec6e288e623dce751c67f8288902454ea', class: "dda-input-dropdown-list" }, this.parsedCurrencies.length > 0 ? (this.parsedCurrencies.map(option => (h("button", { name: this.currency_button_name, type: "button", class: `dda-input-dropdown-item ${this.selected_currency === option ? 'selected' : ''}`, onClick: () => this.selectCurrency(option) }, option)))) : (h("div", { class: "dda-input-dropdown-item" }, "No options available")))))), this.helper_text && h("span", { key: 'e0759262779c7318917670d9932ba820c7a003cf', class: "dda-helper-text" }, this.helper_text), this.error_message && h("span", { key: '2707dc67ec04daf31c3765d718f08a54b072f1d3', class: "dda-error-message" }, this.error_message))));
    }
    static get is() { return "dda-number-field"; }
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
            "currencies": {
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
                "attribute": "currencies",
                "reflect": false
            },
            "selected_currency": {
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
                "attribute": "selected_currency",
                "reflect": false,
                "defaultValue": "'USD'"
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
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "toggle_button_name",
                "reflect": false
            },
            "currency_button_name": {
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
                "attribute": "currency_button_name",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "is_focused": {},
            "isCurrencyDropdownOpen": {}
        };
    }
}
//# sourceMappingURL=dda-number-field.js.map
