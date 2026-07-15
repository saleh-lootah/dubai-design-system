import { h, Host } from "@stencil/core";
export class DdaCreditCard {
    constructor() {
        this.custom_class = '';
    }
    render() {
        const cardClass = [
            'dda-credit-card-container',
            this.design ? `dda-credit-card-${this.design}` : '',
            this.custom_class ? `${this.custom_class}` : "",
            this.component_mode,
        ].filter(Boolean).join(' ');
        return (h(Host, { key: '80c90809592b0cc74374c23638bf15987e5be2e1' }, h("div", { key: 'a03ede233d86d5dc70c70bf398d1824c6e5f9c57', class: cardClass }, h("div", { key: '741c641d49902976248de52ca47188844cfa87c2', class: "dda-credit-card-header" }, h("div", { key: '41d041372af7d429f0723b29442231225cfa0aae', class: "card-balance-info" }, h("span", { key: '9a74124b0cf7cd81714ebf66166facf03113d498', class: "card-balance-label" }, "Current Balance"), h("span", { key: 'de7d1b6971c42ec569f5e7816c157ec4146be10b', class: "card-balance" }, this.balance)), h("i", { key: 'd005ba4858799d925197d1cd7842f6d869474112', class: "material-icons  material-symbols-outlined", "aria-hidden": "true" }, "wifi")), h("div", { key: '65a03f7c6306f481e2dc7710b013c31650daa3de', class: "dda-credit-card-body" }, h("div", { key: 'f55b5e8638c575ef69f17b933437737fcdedaffc', class: "card-userinfo" }, h("span", { key: 'f7791dfad91a38fb42ae03d47d437ab25dcbf706', class: "dda-card-name" }, this.name), h("span", { key: 'e76b674847f147ba42cc9c929b316b19a123c0d4', class: "dda-card-number" }, "**** ", this.card_number.slice(-4))), h("div", { key: '62242551b665079662440a9df94eb2be880ef6ae' }, h("img", { key: 'c6949454a205bd9aa6dae5d401fb84f429aa21bd', src: this.card_type, alt: "Card Type", class: "card-type-icon" }))))));
    }
    static get is() { return "dda-credit-card"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-credit-card.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-credit-card.css", "../../global/global.css"]
        };
    }
    static get properties() {
        return {
            "balance": {
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
                "attribute": "balance",
                "reflect": false
            },
            "name": {
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
                "attribute": "name",
                "reflect": false
            },
            "card_number": {
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
                "attribute": "card_number",
                "reflect": false
            },
            "card_type": {
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
                "attribute": "card_type",
                "reflect": false
            },
            "design": {
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
                "attribute": "design",
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
            }
        };
    }
}
//# sourceMappingURL=dda-credit-card.js.map
