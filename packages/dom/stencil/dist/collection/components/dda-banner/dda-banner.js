import { h, Host } from "@stencil/core";
export class DdaBanner {
    constructor() {
        this.parsedSlides = [];
    }
    componentWillLoad() {
        this.parsedSlides = JSON.parse(this.slides);
    }
    render() {
        return (h(Host, { key: '92d14a388af105158acbb09019642a2c79c49a91' }, h("div", { key: 'c4aac49eabf6b6ec4193961aab7e8f93e6434f83', class: 'dda-banner-slider' }, this.parsedSlides.map((slide) => (h("div", { class: 'dda-banner-slide' }, h("img", { src: slide.image, alt: slide.title, style: { width: this.slider_width, height: this.slider_height } })))))));
    }
    static get is() { return "dda-banner"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-banner.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-banner.css", "../../global/global.css"]
        };
    }
    static get properties() {
        return {
            "slides": {
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
                "attribute": "slides",
                "reflect": false
            },
            "slider_width": {
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
                "attribute": "slider_width",
                "reflect": false
            },
            "slider_height": {
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
                "attribute": "slider_height",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "parsedSlides": {}
        };
    }
}
//# sourceMappingURL=dda-banner.js.map
