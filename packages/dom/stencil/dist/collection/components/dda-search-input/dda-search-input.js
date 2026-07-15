import { h, Host } from "@stencil/core";
export class DdaSearchInput {
    constructor() {
        this.placeholder = 'Search';
        this.size = 'sm'; // default to small size
        this.show_button = false; // control to show/hide search button
        this.has_error = false; // control error state
        this.custom_class = '';
    }
    clearInput() {
        const input = this.el.querySelector('#search');
        if (input) {
            input.value = '';
        }
    }
    render() {
        return (h(Host, { key: '5522a1d4e061c198143f3368473c45ce7c04e7b2' }, h("div", { key: '4f61c7018def9f4a259063aede79e3886eefc760', class: `dda-input-container dda-input-size-${this.size} ${this.component_mode} ${this.custom_class}  ${this.input_status ? `dda-input-${this.input_status}` : ''} ${this.has_error ? 'dda-validation-error' : ''}` }, this.label && h("label", { key: '7ca36a58d11d99be0ac6aba796e47a88b944ec06', htmlFor: this.button_id, class: "dda-input-label" }, this.label), h("div", { key: 'adc4a50a8f8021a73c030fb5fb705207b67687c6', class: "dda-search-area dda-search-action" }, h("i", { key: '3c900e470501e6f98a9c062ac1d03df1fd3b0577', class: "material-icons icon-left" }, "search"), h("input", { key: 'c059402f70ee7ddd512cdd0fde3b436b2b196180', name: this.search_input_name, "aria-label": this.aria_label, id: 'search', type: "text", class: "dda-input-field dda-search-field", placeholder: this.placeholder }), h("div", { key: 'ea44f1604d5403008ca78ff9d8324e5e370af699', class: "dda-search-btngroup" }, h("button", { key: 'e01e13b43b20bb9ebf6c80e40236c28b293faa7c', name: this.close_button_name, "aria-label": this.button_aria_label, id: this.button_id, type: "button", class: "icon-close", onClick: () => this.clearInput() }, h("i", { key: 'a6d872d052f3c6da4bf7fdea56a369043d16138a', class: "material-icons  material-symbols-outlined" }, "close")), this.show_button && (h("button", { key: 'c6d6fe90c54c92021b0f8df38767d2e7c9320f56', name: this.search_button_name, type: "button", class: "dda-btn btn-color-default-primary dda-btn-sm" }, "Search")))), this.helper_text && h("span", { key: '2d25ac9dfc882d738216ede73971584bea1d513c', class: "dda-helper-text" }, this.helper_text), this.error_message && h("span", { key: '4612166d204a8cff36df4985079b0e5a603b09d7', class: "dda-error-message" }, this.error_message))));
    }
    static get is() { return "dda-search-input"; }
    static get originalStyleUrls() {
        return {
            "$": ["../../global/input.css", "../../global/global.css", "../../global/dda-button.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["../../global/input.css", "../../global/global.css", "../../global/dda-button.css"]
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
                "reflect": false,
                "defaultValue": "'Search'"
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
            "size": {
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
                "attribute": "size",
                "reflect": false,
                "defaultValue": "'sm'"
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
            "show_button": {
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
                "attribute": "show_button",
                "reflect": false,
                "defaultValue": "false"
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
            "has_error": {
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
                "attribute": "has_error",
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
                "reflect": false
            },
            "search_input_name": {
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
                "attribute": "search_input_name",
                "reflect": false
            },
            "close_button_name": {
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
                "attribute": "close_button_name",
                "reflect": false
            },
            "search_button_name": {
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
                "attribute": "search_button_name",
                "reflect": false
            }
        };
    }
    static get elementRef() { return "el"; }
}
//# sourceMappingURL=dda-search-input.js.map
