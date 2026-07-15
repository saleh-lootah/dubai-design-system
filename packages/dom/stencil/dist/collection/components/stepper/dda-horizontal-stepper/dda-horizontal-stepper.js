import { h, Host } from "@stencil/core";
export class DdaHorizontalStepper {
    constructor() {
        this.current_step = 1;
        this.parsedSteps = [];
    }
    componentWillLoad() {
        this.parsedSteps = JSON.parse(this.steps);
    }
    render() {
        return (h(Host, { key: 'a28c9bc69b2ee386cb827c3ef09ad9a704fc7c4f' }, h("div", { key: 'aacc3e4e5f69d7b67c39e97ca52dda7a2b07ec47', class: `${this.custom_class} ${this.component_mode} h-stepper-container` }, this.parsedSteps.map((step, index) => (h("div", { class: `h-step ${index === this.current_step ? 'active' : ''} ${index < this.current_step ? 'completed' : ''}` }, h("div", { class: "h-step-indicator" }, h("div", { class: "circle" })), h("div", { class: "h-step-content" }, h("div", { class: "h-step-title" }, step.title), h("div", { class: "h-step-subtitle" }, step.subtitle), h("div", { class: "h-step-description" }, step.description))))))));
    }
    static get is() { return "dda-horizontal-stepper"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-horizontal-stepper.css", "../../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-horizontal-stepper.css", "../../../global/global.css"]
        };
    }
    static get properties() {
        return {
            "steps": {
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
                "attribute": "steps",
                "reflect": false
            },
            "current_step": {
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
                "attribute": "current_step",
                "reflect": false,
                "defaultValue": "1"
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
            }
        };
    }
    static get states() {
        return {
            "parsedSteps": {}
        };
    }
}
//# sourceMappingURL=dda-horizontal-stepper.js.map
