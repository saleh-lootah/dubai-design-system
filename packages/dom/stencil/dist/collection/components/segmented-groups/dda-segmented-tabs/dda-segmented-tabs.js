import { h } from "@stencil/core";
export class DdaSegmentedTabs {
    constructor() {
        this.parsedItems = [];
    }
    componentWillLoad() {
        this.parsedItems = JSON.parse(this.items);
    }
    render() {
        return (h("div", { key: '35ec99e3060f01bfb93a99a4452f10bb8ee972cf', class: `dda-segmented-group ${this.custom_class} ${this.radius_type} ${this.component_mode}` }, this.parsedItems.map(item => (item.startsWith('fo') ?
            h("button", { name: this.button_name, class: "dda-segmented-item" }, h("i", { class: "material-icons  material-symbols-outlined" }, item)) :
            h("button", { name: this.button_name, class: "dda-segmented-item" }, item)))));
    }
    static get is() { return "dda-segmented-tabs"; }
    static get originalStyleUrls() {
        return {
            "$": ["../../../global/global.css", "dda-segmented-tabs.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["../../../global/global.css", "dda-segmented-tabs.css"]
        };
    }
    static get properties() {
        return {
            "items": {
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
                "attribute": "items",
                "reflect": false
            },
            "radius_type": {
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
                "attribute": "radius_type",
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
}
//# sourceMappingURL=dda-segmented-tabs.js.map
