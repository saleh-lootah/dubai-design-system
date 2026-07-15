import { h } from "@stencil/core";
export class DdaAlert {
    constructor() {
        this.type = 'primary';
        this.variation = 'info';
        this.title_text = '';
        this.description = '';
        this.button_text = '';
        this.custom_class = '';
        this.firstClickHandler = () => {
            this.firstClick.emit();
        };
        this.secondClickHandler = () => {
            this.secondClick.emit();
        };
    }
    render() {
        return (h("div", { key: 'eb6174e53481246179b70cecdcecac9eeafde6b8', class: `dda-alert dda-alert-${this.type} dda-alert-${this.variation} ${this.custom_class} ${this.component_mode}` }, h("i", { key: '11a18656f81c927a78daa13a28e88e766bcd405c', class: "material-icons  material-symbols-outlined" }, "info"), h("div", { key: 'ddbcbf5dc210f5a06d86b0973cecd608be31698d', class: "alert-content" }, h("h4", { key: 'c9806898761efe7c5d5e23d914a6bed6cb682a78', class: "alert-title" }, this.title_text), h("p", { key: '9a13c30909b5d91f7cc11c04ea8ed88ed5aaef53', class: "alert-description" }, this.description), h("div", { key: '87f2d750450537f2233aff225f8d673dc9faf4b5', class: "alert-btn-wrap" }, !!this.first_button && (h("a", { key: '11a2b273e7e0c1c79dda9a9d01274192f72f3ef7', href: this.first_link, onClick: () => this.firstClickHandler() }, this.first_button)), !!this.second_button && (h("a", { key: '58e169e1dc77dc038f9d8814d5fa97a7bf3d1b48', href: this.second_link, onClick: () => this.secondClickHandler() }, this.second_button)))), h("button", { key: '3c65263e0884716162268402b5f5ad0d5d13bf22', name: this.button_name, class: "dda-alert-close", onClick: this.clickHandler }, h("i", { key: 'cf5c1ff5d08a31780696bf27afe2711f601ae9ea', class: "material-icons  material-symbols-outlined" }, "close"))));
    }
    static get is() { return "dda-alert"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-alert.css", "../../global/global.css", "../../global/dda-button.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-alert.css", "../../global/global.css", "../../global/dda-button.css"]
        };
    }
    static get properties() {
        return {
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'primary' | 'secondary'",
                    "resolved": "\"primary\" | \"secondary\"",
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
                "defaultValue": "'primary'"
            },
            "variation": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'info' | 'warning' | 'error' | 'success'",
                    "resolved": "\"error\" | \"info\" | \"success\" | \"warning\"",
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
                "attribute": "variation",
                "reflect": false,
                "defaultValue": "'info'"
            },
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
                "reflect": false,
                "defaultValue": "''"
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
                "reflect": false,
                "defaultValue": "''"
            },
            "button_text": {
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
                "attribute": "button_text",
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
            "component_id": {
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
                "attribute": "component_id",
                "reflect": false
            },
            "first_link": {
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
                "attribute": "first_link",
                "reflect": false
            },
            "second_link": {
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
                "attribute": "second_link",
                "reflect": false
            },
            "first_button": {
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
                "attribute": "first_button",
                "reflect": false
            },
            "second_button": {
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
                "attribute": "second_button",
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
    static get events() {
        return [{
                "method": "firstClick",
                "name": "firstClick",
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
            }, {
                "method": "secondClick",
                "name": "secondClick",
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
//# sourceMappingURL=dda-alert.js.map
