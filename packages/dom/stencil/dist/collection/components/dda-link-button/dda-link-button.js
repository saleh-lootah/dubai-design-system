import { Host, h } from "@stencil/core";
export class DdaLinkButton {
    constructor() {
        /** Type of button, e.g., "button", "submit" */
        this.type = 'button';
        /** Disable the button */
        this.disabled = false;
        /** Icon class for the starting icon */
        this.start_icon = '';
        this.end_icon = ''; // icon class
        this.aria_label = '';
        this.button_color = 'primary'; // e.g., 'primary', 'error'
        this.button_shape = '';
        this.icon_button_shape = '';
        this.custom_class = ''; // Custom class prop
        this.href = '#'; // Custom class prop
    }
    render() {
        const linkbuttonClass = [
            'dda-btn',
            `btn-color-${this.button_color}`,
            this.size ? `btn-size-${this.size}` : '',
            this.button_shape ? `btn-shape-${this.button_shape}` : '',
            this.icon_button_shape ? `icon-btn-${this.icon_button_shape}` : '',
            this.gap ? `dda-gap-${this.gap}` : '',
            this.custom_class, // Include custom class
            this.component_mode,
        ].filter(Boolean).join(' ');
        return (h(Host, { key: '4e14e675f584dd8ea156dfb275b3a47a4103e5f6' }, h("a", { key: '87e200e0d9b1f4c90568db64516c0ff2c36a3300',
            //   type={this.type}
            id: this.button_id, href: this.href, class: linkbuttonClass, "aria-label": this.aria_label }, this.start_icon && h("i", { key: '32e2ab8d8a2d0176bf0383dfd1c642acc60c5610', class: "material-icons  material-symbols-outlined" }, this.start_icon), h("slot", { key: '1df5794f2f47bd1b6379df360225c8f8421392c2' }), this.end_icon && h("i", { key: '2901db28a23b769fa4de498cfae56abb73638a10', class: "material-icons  material-symbols-outlined" }, this.end_icon))));
    }
    static get is() { return "dda-link-button"; }
    static get originalStyleUrls() {
        return {
            "$": ["../../global/dda-button.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["../../global/dda-button.css", "../../global/global.css"]
        };
    }
    static get properties() {
        return {
            "type": {
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
                    "text": "Type of button, e.g., \"button\", \"submit\""
                },
                "getter": false,
                "setter": false,
                "attribute": "type",
                "reflect": false,
                "defaultValue": "'button'"
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
                    "text": "Disable the button"
                },
                "getter": false,
                "setter": false,
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            },
            "start_icon": {
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
                    "text": "Icon class for the starting icon"
                },
                "getter": false,
                "setter": false,
                "attribute": "start_icon",
                "reflect": false,
                "defaultValue": "''"
            },
            "end_icon": {
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
                "attribute": "end_icon",
                "reflect": false,
                "defaultValue": "''"
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
                "reflect": false,
                "defaultValue": "''"
            },
            "button_color": {
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
                "attribute": "button_color",
                "reflect": false,
                "defaultValue": "'primary'"
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
            "button_shape": {
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
                "attribute": "button_shape",
                "reflect": false,
                "defaultValue": "''"
            },
            "icon_button_shape": {
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
                "attribute": "icon_button_shape",
                "reflect": false,
                "defaultValue": "''"
            },
            "gap": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
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
                "attribute": "gap",
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
            "href": {
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
                "attribute": "href",
                "reflect": false,
                "defaultValue": "'#'"
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
            }
        };
    }
}
//# sourceMappingURL=dda-link-button.js.map
