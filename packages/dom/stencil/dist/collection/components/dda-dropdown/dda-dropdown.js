import { h, Host } from "@stencil/core";
export class DdaDropdown {
    constructor() {
        this.disabled = false;
        this.type = 'bg-white';
        this.size = 'medium';
        this.icon_mode = false; // New prop for icon mode
        this.custom_class = '';
        this.isopen = false;
    }
    get parsedOptions() {
        try {
            return JSON.parse(this.options);
        }
        catch (_a) {
            return [];
        }
    }
    toggleDropdown() {
        if (!this.disabled) {
            this.isopen = !this.isopen;
        }
    }
    selectOption(option) {
        if (!this.disabled) {
            this.selected = option;
            this.isopen = false;
        }
    }
    render() {
        const containerClass = [
            'dda-input-container dda-inline-flex',
            this.disabled ? 'dda-input-disabled' : '',
            this.size ? `dda-input-size-${this.size}` : '',
            this.custom_class ? `${this.custom_class}` : '',
            this.component_mode,
        ].filter(Boolean).join(' ');
        return (h(Host, { key: 'c6755fc2f9e16fe45426397455282278c9edccd4' }, h("div", { key: '104ab8eaa455abf678d6979923938ee7ad3b1a4e', class: containerClass }, this.label && h("label", { key: '7bd256c5353e8f67a7cbc5a42bb4b67ea11c8be9', htmlFor: this.button_id, class: "dda-input-label" }, this.label), h("div", { key: 'ab93255d91e990fb6eee06eeea8f8f2ceda9d239', class: `dda-dropdown-container ${this.type}` }, h("button", { key: '9cd1ee979ac81fb367809569a942b4a6f43704df', id: this.button_id, name: this.arrow_button_name, "aria-label": this.aria_label, type: "button", class: "dda-input-field dda-dropdown-header", onClick: () => this.toggleDropdown() }, h("i", { key: '9da0e2bfe9531497041fdea2618872f448099276', class: `three-dots material-icons` }, this.isopen ? 'more_vert' : 'more_vert'), !this.icon_mode && h("span", { key: 'c77720dd404fd4cd4552491756c4581d2e27c98d', class: "dda-dropdown-text" }, h("span", { key: '6176b5e0e195ab99c155a8e99f5ab51b1fc2b732' }, this.selected || 'Select an option'), " ", h("i", { key: '5d6ca123edf3c751dda7e13a98c1926790df82a4', class: `material-icons` }, this.isopen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'))), this.isopen && (h("div", { key: '164eefe17dd28c3afea2bc985477ea6604e8a062', class: "dda-input-dropdown-list" }, this.parsedOptions.length > 0 ? (this.parsedOptions.map(option => (h("button", { type: "button", name: this.dropdown_button_name, class: `dda-input-dropdown-item ${this.selected === option ? 'selected' : ''}`, onClick: () => { this.selectOption(option); } }, option)))) : (h("div", { class: "dda-input-dropdown-item" }, "No options available"))))), this.helper_text && h("span", { key: 'a58b4611db188786e235d70e2f5883fc695641da', class: "dda-helper-text" }, this.helper_text), this.error && h("span", { key: '33860730d0089788e3ac842e3ef380cd6273e3fd', class: "dda-error-message" }, this.error))));
    }
    static get is() { return "dda-dropdown"; }
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
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "error",
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
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'bg-transparent' | 'bg-white'",
                    "resolved": "\"bg-transparent\" | \"bg-white\"",
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
                "attribute": "type",
                "reflect": false,
                "defaultValue": "'bg-white'"
            },
            "size": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'small' | 'medium'",
                    "resolved": "\"medium\" | \"small\"",
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
                "attribute": "size",
                "reflect": false,
                "defaultValue": "'medium'"
            },
            "icon_mode": {
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
                "attribute": "icon_mode",
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
            "arrow_button_name": {
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
                "attribute": "arrow_button_name",
                "reflect": false
            },
            "dropdown_button_name": {
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
                "attribute": "dropdown_button_name",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "isopen": {}
        };
    }
}
//# sourceMappingURL=dda-dropdown.js.map
