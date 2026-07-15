import { h, Host } from "@stencil/core";
export class DdaTooltip {
    constructor() {
        this.position = 'top'; // Default to top position
        this.custom_class = '';
    }
    render() {
        return (h(Host, { key: 'de0c09d6c6430f2a166785d1c405bbc90cc1f4f3' }, h("div", { key: 'f439b79181d4c912fa93f8cc3cc59bfced98bb87', class: `dda-tooltip-container ${this.custom_class} ${this.component_mode}` }, h("slot", { key: '462e1f0f2de1b96da357c25c182fb819f6d54543' }), h("div", { key: '7676df25a3febbf2f8629a846ebd5e350c149a2d', class: `dda-tooltip-box ${this.position}` }, h("strong", { key: 'b7a14506db338b3bcde8e3b64891d1268961b8cf' }, this.title_text), h("p", { key: 'fe68d986f4f9d014be4744d6b56f801eb182265b' }, this.description)))));
    }
    static get is() { return "dda-tooltip"; }
    static get originalStyleUrls() {
        return {
            "$": ["../../global/global.css", "dda-tooltip.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["../../global/global.css", "dda-tooltip.css"]
        };
    }
    static get properties() {
        return {
            "title_text": {
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
                "attribute": "title_text",
                "reflect": false
            },
            "description": {
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
                "attribute": "description",
                "reflect": false
            },
            "position": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'top' | 'bottom' | 'left' | 'right'",
                    "resolved": "\"bottom\" | \"left\" | \"right\" | \"top\"",
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
                "attribute": "position",
                "reflect": false,
                "defaultValue": "'top'"
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
            }
        };
    }
}
//# sourceMappingURL=dda-tooltip.js.map
