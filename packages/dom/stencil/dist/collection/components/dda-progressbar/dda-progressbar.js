import { h, Host } from "@stencil/core";
export class DdaProgressBar {
    constructor() {
        this.progress = 0;
        this.tooltip = false;
        this.tooltip_position = 'top';
        this.show_percentage_text = false;
    }
    render() {
        const progressStyle = {
            width: `${this.progress}%`,
        };
        return (h(Host, { key: '1cbbb0344201cb0fdd63f680c691035a45087bef' }, h("div", { key: 'f86d423baf6a4ac918110d898552db7bd68b7c60', class: `dda-progress-bar-container ${this.custom_class} ${this.component_mode}` }, h("div", { key: '68623fd7cf6676735075dca6150dfbf8ece6d87c', class: "dda-progress-bar" }, h("div", { key: 'e9c08e921057ee5ab1ba4da470b0af96de2ba9b0', class: "dda-progress-value", style: progressStyle }, this.tooltip && (h("div", { key: '7ee128960c876bfd673fffeca1b7b7f788337092', class: `dda-tooltip tooltip-${this.tooltip_position}` }, this.progress, "%")))), this.show_percentage_text && (h("span", { key: '366b374232873e5fe6e3ca62f827b513749540d6', class: "dda-percentage-text" }, this.progress, "%")))));
    }
    static get is() { return "dda-progressbar"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-progressbar.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-progressbar.css", "../../global/global.css"]
        };
    }
    static get properties() {
        return {
            "progress": {
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
                "attribute": "progress",
                "reflect": false,
                "defaultValue": "0"
            },
            "tooltip": {
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
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "tooltip",
                "reflect": false,
                "defaultValue": "false"
            },
            "tooltip_position": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'top' | 'bottom'",
                    "resolved": "\"bottom\" | \"top\"",
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
                "attribute": "tooltip_position",
                "reflect": false,
                "defaultValue": "'top'"
            },
            "show_percentage_text": {
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
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "attribute": "show_percentage_text",
                "reflect": false,
                "defaultValue": "false"
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
            }
        };
    }
}
//# sourceMappingURL=dda-progressbar.js.map
