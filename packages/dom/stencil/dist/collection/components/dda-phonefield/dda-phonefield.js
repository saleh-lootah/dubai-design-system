import { h, Host } from "@stencil/core";
import { CountriesList } from "../../assets/countries";
export class DdaPhoneField {
    constructor() {
        this.placeholder = 'Enter phone number';
        this.disabled = false;
        this.country_code = '+971';
        this.country_flag = 'https://flagcdn.com/w320/ae.png'; // Default UAE flag
        this.phone_number = '';
        this.is_focused = false;
        this.dropdown_open = false;
        this.countries = [];
    }
    // componentWillLoad() {
    //   fetch('/path/to/countries.json')
    //     .then(response => response.json())
    //     .then(data => {
    //       this.countries = data;
    //     });
    // }
    componentWillLoad() {
        this.countries = CountriesList;
    }
    toggleDropdown() {
        this.dropdown_open = !this.dropdown_open;
    }
    selectCountry(country) {
        this.country_code = country.code;
        this.country_flag = country.flag;
        this.dropdown_open = false;
    }
    handleFocus() {
        this.is_focused = true;
    }
    handleBlur() {
        this.is_focused = false;
    }
    handlephonenumberChange(event) {
        const target = event.target;
        const targetvalue = target.value.replace(/[^0-9.]/g, '');
        this.phone_number = targetvalue;
    }
    render() {
        const inputClass = `${this.component_mode} ${this.size ? `dda-input-size-${this.size}` : ''} ${this.error_message ? `dda-error-message` : ''}  ${this.validation_type ? `dda-validation-${this.validation_type}` : ''}  ${this.is_focused ? 'dda-input-focus' : ''} ${this.phone_number ? 'dda-input-focus-filled' : ''}`;
        return (h(Host, { key: 'c8e32d69f11e19904ad3ef96032cd919ddbb66d9' }, h("div", { key: '24a62fb35dd2214564c2b830b42984aa44dbafdb', class: `dda-input-container ${inputClass} ${this.custom_class} ${this.disabled ? 'dda-input-disabled' : ''}` }, this.label && h("label", { key: '59acc76368fe6c892526938bc84ec2bc1bc6e406', htmlFor: this.input_id, class: "dda-input-label" }, this.label), h("div", { key: 'fc589cd2e80aaecee795debfa386ea4d2958983c', class: `dda-input-field-group dda-phone-field` }, h("div", { key: '05673ec0f673ec88879a39d6c490b8fd81ec4bfd', class: "dda-input-dropdown-btn" }, h("button", { key: 'a17f069c73a169cf60e98b7f9e84ead7a47a713c', type: "button", name: this.toggle_button_name, class: "dda-dropdown-select", onClick: () => this.toggleDropdown() }, h("img", { key: 'a9983e5420b09631bed6fd4f64eb7e2ae8286f9f', src: this.country_flag, alt: "", width: "20" }), " ", this.country_code, " ", h("i", { key: '39f7fedea5a8a48c402944760b3bc45b85c8e28c', class: `material-icons` }, this.dropdown_open ? 'keyboard_arrow_down' : 'keyboard_arrow_down')), this.dropdown_open && (h("div", { key: '4ddc0b26ac01951a068d99e3b519ee6201145aac', class: "dda-input-dropdown-list" }, this.countries.map(country => (h("button", { id: this.button_id, name: this.country_select_button_name, "aria-label": this.button_aria_label, type: "button", class: "dda-input-dropdown-item", onClick: () => this.selectCountry(country) }, h("img", { src: country.flag, alt: "", width: "20" }), " ", country.code)))))), h("input", { key: '7da52b2a63349c3d9979e4991f1d84f71cabe38d', id: this.input_id, name: this.phone_input_name, "aria-label": this.aria_label, type: "number", class: `dda-field-group-input`, placeholder: this.placeholder, inputmode: 'numeric', pattern: "[0-9]*", value: this.phone_number, onInput: this.handlephonenumberChange.bind(this), onFocus: this.handleFocus.bind(this), onBlur: this.handleBlur.bind(this), disabled: this.disabled })), this.helper_text && !this.validation_type && h("span", { key: '67f0422add72c7f7218eb53d017612c54160e831', class: "dda-helper-text" }, this.helper_text), this.error_message && h("span", { key: '9692c2fa2e542e89e0a5ecbb802ceafa841966dd', class: "dda-error-message" }, this.error_message))));
    }
    static get is() { return "dda-phonefield"; }
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
                "reflect": false,
                "defaultValue": "'Enter phone number'"
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
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "custom_class",
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
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "button_id",
                "reflect": false
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
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "button_aria_label",
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
            "country_select_button_name": {
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
                "attribute": "country_select_button_name",
                "reflect": false
            },
            "phone_input_name": {
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
                "attribute": "phone_input_name",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "country_code": {},
            "country_flag": {},
            "phone_number": {},
            "is_focused": {},
            "dropdown_open": {},
            "countries": {}
        };
    }
}
//# sourceMappingURL=dda-phonefield.js.map
