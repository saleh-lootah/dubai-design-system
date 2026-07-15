import { h } from "@stencil/core";
export class DdaAvatar {
    constructor() {
        this.type = 'photo';
        this.size = 'md';
        this.design = 'default';
        this.rounded = 'circle';
        this.src = ''; // For photo type
        this.icon = 'material-icons'; // For icon type
        this.text = 'AB'; // For text type
        this.notification_number = 0; // For notification design
        this.custom_class = '';
        this.isOpen = false;
    }
    toggleDropdown() {
        this.isOpen = !this.isOpen;
    }
    selectOption(option) {
        this.selected = option;
        this.isOpen = false;
    }
    get parsedOptions() {
        try {
            return JSON.parse(this.options);
        }
        catch (_a) {
            return [];
        }
    }
    render() {
        return (h("div", { key: '8e91f061b888c7894b7981af4409be061b158e17', onClick: () => this.toggleDropdown(), class: {
                'dda-avatar': true,
                [`avatar-type-${this.type}`]: true,
                [`avatar-size-${this.size}`]: true,
                [`avatar-design-${this.design}`]: true,
                [`avatar-shape-${this.rounded}`]: true,
                [`${this.custom_class}`]: true,
                [`${this.component_mode}`]: true,
                [`${this.button_name}`]: true,
            } }, this.isOpen && (h("div", { key: '3a5419c44b3f6ceafedf78bcc0707cc4cef96881', class: "dda-input-dropdown-list" }, this.parsedOptions.length > 0 ? (this.parsedOptions.map(option => (h("button", { id: this.button_id, name: this.button_name, "aria-label": this.aria_label, type: "button", class: `dda-input-dropdown-item ${this.selected === option ? 'selected' : ''}`, onClick: () => { this.selectOption(option); } }, option)))) : (h("div", { class: "dda-input-dropdown-item" }, "No options available")))), this.type === 'photo' && h("img", { key: '19d1c336aac986ad15239d184120cfcc58ccd87f', src: this.src, alt: "Avatar" }), this.type === 'icon' && h("i", { key: '509aa372ae87d6b6644a2d67a80a4735eafdb1fa', class: `${this.icon} dda-smile` }, "sentiment_satisfied"), this.type === 'text' && h("span", { key: 'fca33de5a29c6b80f2d8a2f37287974fe54791d0', class: 'avatar-main-text' }, this.text), this.design === 'status' && h("div", { key: 'e7e83ce196a022e79b1067bd217f6f069b16250e', class: "status-circle" }), this.design === 'verified' && h("div", { key: 'cb47d6a6037a3584cd2a3d9ba683afec47823f54', class: "verified-icon" }, h("span", { key: '6daa633c6fc0d25bf6351ee6df68c6bee45af1e4', class: "material-icons  material-symbols-outlined" }, "verified")), this.design === 'notification' && h("div", { key: '3d959ee3127abb74951ba9109a06ed45bb305405', class: "notification-circle" }, this.notification_number)));
    }
    static get is() { return "dda-avatar"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-avatar.css", "../../global/input.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-avatar.css", "../../global/input.css", "../../global/global.css"]
        };
    }
    static get properties() {
        return {
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'photo' | 'icon' | 'text'",
                    "resolved": "\"icon\" | \"photo\" | \"text\"",
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
                "defaultValue": "'photo'"
            },
            "size": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'",
                    "resolved": "\"lg\" | \"md\" | \"sm\" | \"xl\" | \"xs\" | \"xxl\"",
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
                "defaultValue": "'md'"
            },
            "design": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'default' | 'status' | 'verified' | 'story' | 'notification'",
                    "resolved": "\"default\" | \"notification\" | \"status\" | \"story\" | \"verified\"",
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
                "defaultValue": "'default'"
            },
            "rounded": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'square' | 'circle'",
                    "resolved": "\"circle\" | \"square\"",
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
                "attribute": "rounded",
                "reflect": false,
                "defaultValue": "'circle'"
            },
            "src": {
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
                "attribute": "src",
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
                "reflect": false,
                "defaultValue": "'material-icons'"
            },
            "text": {
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
                "attribute": "text",
                "reflect": false,
                "defaultValue": "'AB'"
            },
            "notification_number": {
                "type": "number",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
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
                "attribute": "notification_number",
                "reflect": false,
                "defaultValue": "0"
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
            "button_name": {
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
                "attribute": "button_name",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "isOpen": {}
        };
    }
}
//# sourceMappingURL=dda-avatar.js.map
