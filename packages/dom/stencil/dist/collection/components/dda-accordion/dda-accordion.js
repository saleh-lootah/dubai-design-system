import { h, Host } from "@stencil/core";
export class DdaAccordion {
    constructor() {
        this.design = 'bg-border'; // Default to background and border design
        this.header_text = 'Accordion Header'; // Default header text
        this.body_description = ''; // Default body description
        this.custom_class = '';
        this.accordion_icon = 'info'; // Default Material icon
        this.isOpen = false;
    }
    toggleAccordion() {
        this.isOpen = !this.isOpen;
    }
    render() {
        return (h(Host, { key: 'cd0dd867e434331c84f7f86d4bf4dd8d680f82a2' }, h("div", { key: '70aeef8f474f016a1a9554203150447cb466360a', class: `accordion-container ${this.design} ${this.custom_class} ${this.component_mode}` }, h("div", { key: '4c848dbdd5e15e35f4fab1984e920fdac99d1b53', class: "accordion-header", onClick: () => this.toggleAccordion() }, h("div", { key: 'cb71dc014b702b885e69dbb8eabd2be4cf3ff294', class: "header-content" }, h("i", { key: '712a6f611881f6341830001482aa7647e66fff4f', class: "material-icons  material-symbols-outlined" }, this.accordion_icon), h("span", { key: 'ece131f9aed424c45df48f173cf2a07b7fb4a046', class: "header-text" }, this.header_text)), h("i", { key: 'd85a90a4daff9ab1f7aa47061e04f75562fe114b', class: `material-icons arrow-icon` }, this.isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down')), h("div", { key: '2faf6d674e624a3d1eb7ebc89223021d873a4d9c', class: this.isOpen ? 'accordion-body' : 'dda-d-none' }, h("p", { key: '6fc65ed931c4f9f70403f6851ee9a77a8fe7bcd0', class: "body-description" }, this.body_description), h("slot", { key: 'c5d4a56dd997c303bd37c7377251b8b87c1c8ec5' })))));
    }
    static get is() { return "dda-accordion"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-accordion.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-accordion.css", "../../global/global.css"]
        };
    }
    static get properties() {
        return {
            "design": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'bg-border' | 'no-border'",
                    "resolved": "\"bg-border\" | \"no-border\"",
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
                "reflect": false,
                "defaultValue": "'bg-border'"
            },
            "header_text": {
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
                "attribute": "header_text",
                "reflect": false,
                "defaultValue": "'Accordion Header'"
            },
            "body_description": {
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
                "attribute": "body_description",
                "reflect": false,
                "defaultValue": "''"
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
            "accordion_icon": {
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
                "attribute": "accordion_icon",
                "reflect": false,
                "defaultValue": "'info'"
            }
        };
    }
    static get states() {
        return {
            "isOpen": {}
        };
    }
}
//# sourceMappingURL=dda-accordion.js.map
