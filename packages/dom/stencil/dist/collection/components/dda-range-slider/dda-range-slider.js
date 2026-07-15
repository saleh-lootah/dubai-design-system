import { h, Host } from "@stencil/core";
export class DdaRangeSlider {
    constructor() {
        this.min = 0;
        this.max = 100;
        this.step = 1;
        this.initial_min = 0;
        this.initial_max = 100;
        this.custom_class = '';
    }
    componentWillLoad() {
        this.min_value = this.initial_min;
        this.max_value = this.initial_max;
    }
    handleMinChange(event) {
        const value = Number(event.target.value);
        if (value <= this.max_value - this.step) {
            this.min_value = value;
        }
    }
    handleMaxChange(event) {
        const value = Number(event.target.value);
        if (value >= this.min_value + this.step) {
            this.max_value = value;
        }
    }
    getPercentage(value) {
        return ((value - this.min) / (this.max - this.min)) * 100;
    }
    render() {
        return (h(Host, { key: '9f56d7653eae6dd59536c17a653c1ebfb78dca6c' }, h("div", { key: '386fc45f0974eac81b998064998e565e45c46552', class: `dda-range-slider-container dda-tooltip-${this.tooltip_position} ${this.custom_class} ${this.component_mode}` }, h("div", { key: 'ab33c978e089b8f7ae4234bdecd93b5f5752daa1', class: "dda-range-slider" }, h("div", { key: '3c6ae60ab82b4c7da6c4661932de479f618406c8', class: "dda-range-slider-track", style: {
                left: `${this.getPercentage(this.min_value)}%`,
                right: `${100 - this.getPercentage(this.max_value)}%`,
            } }, h("span", { key: '392598b4196a8e59ffec60815991ed71026e5028', class: "min-label" }, this.min_value, "%"), h("span", { key: '81555b4c924da122363e24549e1c3d8e204b3a57', class: "max-label" }, this.max_value, "%")), h("label", { key: '4121dd3f9e55f32f098e93396e28d72de8017b32', htmlFor: this.left_input_id }, h("input", { key: 'f69117a97159ea29dcf9a69f0dc6720b29a993a6', id: this.left_input_id, name: this.left_input_name, "aria-label": this.left_aria_label, type: "range", min: this.min, max: this.max, step: this.step, value: this.min_value, onInput: (event) => this.handleMinChange(event), class: "dda-range-slider-input", style: { zIndex: `${this.min_value > this.max - this.min_value ? 5 : 3}` } })), h("label", { key: '0bb8b51ee1eb62cf7fd3a01203a4f8b7698fed65', htmlFor: this.right_input_id }, h("input", { key: 'd78cff142eef24e08b4abee2aef2101af23c8796', id: this.right_input_id, name: this.right_input_name, "aria-label": this.right_aria_label, type: "range", min: this.min, max: this.max, step: this.step, value: this.max_value, onInput: (event) => this.handleMaxChange(event), class: "dda-range-slider-input", style: { zIndex: `${this.max_value < this.max - this.min_value ? 5 : 3}` } }))))));
    }
    static get is() { return "dda-range-slider"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-range-slider.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-range-slider.css"]
        };
    }
    static get properties() {
        return {
            "min": {
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
                "attribute": "min",
                "reflect": false,
                "defaultValue": "0"
            },
            "max": {
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
                "attribute": "max",
                "reflect": false,
                "defaultValue": "100"
            },
            "step": {
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
                "attribute": "step",
                "reflect": false,
                "defaultValue": "1"
            },
            "initial_min": {
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
                "attribute": "initial_min",
                "reflect": false,
                "defaultValue": "0"
            },
            "initial_max": {
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
                "attribute": "initial_max",
                "reflect": false,
                "defaultValue": "100"
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
            "tooltip_position": {
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
                "attribute": "tooltip_position",
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
            },
            "left_input_id": {
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
                "attribute": "left_input_id",
                "reflect": false
            },
            "right_input_id": {
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
                "attribute": "right_input_id",
                "reflect": false
            },
            "left_aria_label": {
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
                "attribute": "left_aria_label",
                "reflect": false
            },
            "right_aria_label": {
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
                "attribute": "right_aria_label",
                "reflect": false
            },
            "left_input_name": {
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
                "attribute": "left_input_name",
                "reflect": false
            },
            "right_input_name": {
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
                "attribute": "right_input_name",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "min_value": {},
            "max_value": {}
        };
    }
}
//# sourceMappingURL=dda-range-slider.js.map
