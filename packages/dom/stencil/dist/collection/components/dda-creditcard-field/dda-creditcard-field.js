import { h, Host } from "@stencil/core";
export class DdaCreditCardField {
    constructor() {
        this.value = '';
        this.disabled = false;
        this.custom_class = '';
        this.restrict_input = false;
        this.formattedValue = '';
    }
    handleInput(event) {
        const inputElement = event.target;
        const inputValue = inputElement.value.replace(/[^0-9-]/g, '');
        const maxLength = this.restrict_input ? 100 : 25;
        if (inputValue.length <= maxLength) {
            this.value = inputValue;
            this.formatCardNumber(this.value);
            inputElement.value = this.formattedValue;
        }
        else {
            inputElement.value = this.formattedValue;
        }
    }
    formatCardNumber(value) {
        const cleaned = value.replace(/\D/g, '');
        const matched = cleaned.match(/.{1,4}/g);
        if (matched) {
            this.formattedValue = matched.join(' - ');
        }
        else {
            this.formattedValue = cleaned;
        }
    }
    componentWillLoad() {
        this.formatCardNumber(this.value);
    }
    render() {
        const inputClass = [
            'dda-input-container dda-credit-card-field',
            this.validation_type ? `dda-validation-${this.validation_type}` : '',
            this.size ? `dda-input-size-${this.size}` : '',
            this.input_type ? `dda-input-${this.input_type}` : '',
            this.disabled ? 'dda-input-disabled' : '',
            this.error_message ? 'dda-error-message' : '',
            this.custom_class ? `${this.custom_class}` : '',
            this.component_mode,
        ].filter(Boolean).join(' ');
        return (h(Host, { key: 'b481f0e86197ce680bf2d2c611e115a0cced0cba' }, h("div", { key: 'be1948da3eec651b0268321aaffc0a4eb3928a8d', class: inputClass }, this.label && h("label", { key: '2e3691fc59984c8da3dd86f2c3b85aac0b958e18', htmlFor: this.input_id, class: "dda-input-label" }, this.label), h("div", { key: 'b9e6098a029349ae086e96a8522fa16c80069b2f', class: "dda-input-field-wrapper" }, this.card_icon && h("img", { key: '598592bd4a94c900c7f237f0fc8be92cac86de97', src: this.card_icon, alt: "Card Icon", class: "dda-creditcard-icon" }), h("input", { key: '5032363eb7f0c43fed80de1079890ba06ce28d14', "aria-label": this.aria_label, id: this.input_id, name: this.input_name, type: "text", inputmode: "numeric", placeholder: this.placeholder, value: this.formattedValue, onInput: (event) => this.handleInput(event), class: "dda-input-field", disabled: this.disabled, maxlength: this.restrict_input ? 100 : 25 })), this.helper_text && h("span", { key: 'eb6e51b26538ddf9bd257830843c90b2a79cce98', class: "dda-helper-text" }, this.helper_text), this.error_message && h("span", { key: 'e09a6d0dad0f2130e47a09a1d83af3cf00edff44', class: "dda-error-message" }, this.error_message))));
    }
    static get is() { return "dda-creditcard-field"; }
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
                "reflect": false,
                "defaultValue": "''"
            },
            "card_icon": {
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
                "attribute": "card_icon",
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
            "restrict_input": {
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
                "attribute": "restrict_input",
                "reflect": false,
                "defaultValue": "false"
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
            }
        };
    }
    static get states() {
        return {
            "formattedValue": {}
        };
    }
}
//# sourceMappingURL=dda-creditcard-field.js.map
