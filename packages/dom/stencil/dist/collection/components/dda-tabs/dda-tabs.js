import { h, Host } from "@stencil/core";
export class DdaTabs {
    constructor() {
        this.type = 'text';
        this.hover_style = 'dda-tab-default';
        this.border_bottom = false;
        this.custom_class = '';
        this.tab_texts = '["Tab 1", "Tab 2", "Tab 3"]'; // Keep it as a string
        this.tab_icons = '["sentiment_satisfied", "sentiment_satisfied", "sentiment_satisfied"]';
        this.tabhandler = (index) => {
            this.tabClick.emit(index);
        };
        this.active_tab = 0;
    }
    // Parse the stringified array to an actual array
    get parsedTabs() {
        try {
            return JSON.parse(this.tab_texts); // Parse the string into an array
        }
        catch (error) {
            console.error("Error parsing tab_texts:", error);
            return ['Tab 1', 'Tab 2', 'Tab 3']; // Fallback to default
        }
    }
    get parsedIcons() {
        try {
            return JSON.parse(this.tab_icons); // Parse the string into an array
        }
        catch (error) {
            console.error("Error parsing tabicons:", error);
            return ["sentiment_satisfied", "sentiment_satisfied", "sentiment_satisfied"]; // Fallback to default
        }
    }
    setActiveTab(index) {
        this.active_tab = index;
        if (this.tabClick) {
            this.tabhandler(index);
        }
    }
    render() {
        return (h(Host, { key: 'fcefc48389a326c4af16a3b7edd61c1280068a92' }, h("div", { key: '69e770199cc7a46cc625c4dfe3d86056f74b5132', class: `dda-tabs-container ${this.hover_style} ${this.custom_class} ${this.component_mode}` }, this.parsedTabs.map((title, index) => (h("button", { id: this.button_id, name: this.button_name, "aria-label": this.aria_label, type: "button", class: `dda-tab-item ${this.active_tab === index ? 'active' : ''}`, onClick: () => this.setActiveTab(index) }, this.type === 'text-icon' && h("i", { class: `material-icons` }, this.parsedIcons[index] || ""), h("span", null, title)))))));
    }
    static get is() { return "dda-tabs"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-tabs.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-tabs.css", "../../global/global.css"]
        };
    }
    static get properties() {
        return {
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'text' | 'text-icon'",
                    "resolved": "\"text\" | \"text-icon\"",
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
                "defaultValue": "'text'"
            },
            "hover_style": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'dda-tab-default' | 'dda-tab-filed' | 'dda-tab-underline' | 'dda-tab-underline-filled'",
                    "resolved": "\"dda-tab-default\" | \"dda-tab-filed\" | \"dda-tab-underline\" | \"dda-tab-underline-filled\"",
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
                "attribute": "hover_style",
                "reflect": false,
                "defaultValue": "'dda-tab-default'"
            },
            "border_bottom": {
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
                "attribute": "border_bottom",
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
            "tab_texts": {
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
                "attribute": "tab_texts",
                "reflect": false,
                "defaultValue": "'[\"Tab 1\", \"Tab 2\", \"Tab 3\"]'"
            },
            "tab_icons": {
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
                "attribute": "tab_icons",
                "reflect": false,
                "defaultValue": "'[\"sentiment_satisfied\", \"sentiment_satisfied\", \"sentiment_satisfied\"]'"
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
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "button_name",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "active_tab": {}
        };
    }
    static get events() {
        return [{
                "method": "tabClick",
                "name": "tabClick",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }];
    }
}
//# sourceMappingURL=dda-tabs.js.map
