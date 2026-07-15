import { h, Host } from "@stencil/core";
export class DdaChip {
    constructor() {
        this.bg_color = 'success';
        this.rounded = '';
        this.show_close_icon = false;
    }
    render() {
        return (h(Host, { key: '8ceb0992aaba9c0c86ed17e9ae56bc3dc45b5b93' }, h("div", { key: 'f5e750fcca76bc40a8eced2e73925eb5168a584d', class: `dda-chip dda-chip-${this.bg_color} dda-chip-${this.size} dda-rounded-${this.rounded} ${this.custom_class} ${this.component_mode}` }, this.icon ? h("i", { class: "material-icons  material-symbols-outlined" }, this.icon) : null, h("span", { key: 'c58f6d258564530b0af137fb17df8c4e6dd7163e' }, h("slot", { key: '79a978c24b4042467bfa215d1da2550bafe53e07' })), this.show_close_icon && (h("span", { key: 'b012ebc14b552df9edf2081077bf702cc890f98d', class: "chip-close", onClick: this.clickHandler }, h("i", { key: '088a392b885bb62da6acc190f4649032b2284186', class: "material-icons  material-symbols-outlined" }, "close"))))));
    }
    static get is() { return "dda-chip"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-chip.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-chip.css", "../../global/global.css"]
        };
    }
    static get properties() {
        return {
            "bg_color": {
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
                "attribute": "bg_color",
                "reflect": false,
                "defaultValue": "'success'"
            },
            "rounded": {
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
                "attribute": "rounded",
                "reflect": false,
                "defaultValue": "''"
            },
            "icon": {
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
                "attribute": "icon",
                "reflect": false
            },
            "show_close_icon": {
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
                "attribute": "show_close_icon",
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
                "optional": true,
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
            "clickHandler": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "(event: MouseEvent) => void",
                    "resolved": "(event: MouseEvent) => void",
                    "references": {
                        "MouseEvent": {
                            "location": "global",
                            "id": "global::MouseEvent"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false
            }
        };
    }
}
//# sourceMappingURL=dda-chip.js.map
