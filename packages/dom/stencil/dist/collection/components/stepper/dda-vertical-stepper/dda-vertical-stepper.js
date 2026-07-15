import { h, Host } from "@stencil/core";
export class DdaVerticalStepper {
    constructor() {
        this.current_Step = 0;
        this.custom_class = '';
        this.parsedSteps = [];
    }
    componentWillLoad() {
        this.parsedSteps = JSON.parse(this.steps);
    }
    render() {
        return (h(Host, { key: 'c24509092f39fb4757243a70743f98e49b26ff37' }, h("div", { key: 'e3fd0e75eefd0a3bf89998d495966af758df2419', class: `${this.custom_class} ${this.component_mode} v-stepper-container` }, this.parsedSteps.map((step, index) => (h("div", { class: `v-step ${index <= this.current_Step ? 'active' : ''}` }, h("div", { class: "v-step-indicator" }, h("div", { class: "icon" }, h("i", { class: `material-icons` }, step.icon))), h("div", { class: "v-step-content" }, h("div", { class: "v-step-title" }, step.title), h("div", { class: "v-step-subtitle" }, step.subtitle), h("div", { class: "v-step-description" }, step.description)), h("div", { class: "v-step-arrow" }, h("i", { class: "material-icons  material-symbols-outlined" }, "chevron_right"))))))));
    }
    static get is() { return "dda-vertical-stepper"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-vertical-stepper.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-vertical-stepper.css"]
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
            "current_Step": {
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
                "attribute": "current_-step",
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
//# sourceMappingURL=dda-vertical-stepper.js.map
