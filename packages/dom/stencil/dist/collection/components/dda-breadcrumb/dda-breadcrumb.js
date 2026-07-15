import { h, Host } from "@stencil/core";
export class DdaBreadcrumb {
    constructor() {
        this.design = 'text'; // Default to text design
        this.separator = 'chevron_right'; // Default to chevron separator
        this.custom_class = '';
        this.breadcrumbs = [];
    }
    componentWillLoad() {
        const breadcrumbsData = this.el.getAttribute('data-breadcrumbs');
        if (breadcrumbsData) {
            this.breadcrumbs = JSON.parse(breadcrumbsData);
        }
    }
    render() {
        return (h(Host, { key: '065ff7a5acac515294d58a9db822201294f52eb9' }, h("div", { key: '1e652b7395ee92f1c1da42ddc3b96a30f86016ba', class: this.component_mode }, h("nav", { key: '217b7f4b698943dccfedc96450e81b74655291cc', "aria-label": "breadcrumb", class: `${this.custom_class}` }, h("ol", { key: 'edf63d7ce09adff2f218abe85e5cd2229f65f175', class: "dda-breadcrumb" }, this.breadcrumbs && this.breadcrumbs.map((crumb, index) => (h("li", { class: `dda-breadcrumb-item ${index === this.breadcrumbs.length - 1 ? 'active' : ''}` }, h("a", { href: crumb.url }, this.design !== 'text' && h("i", { class: `material-icons` }, crumb.icon), this.design !== 'icon' && h("span", null, crumb.text)), index < this.breadcrumbs.length - 1 && (h("i", { class: `material-icons material-symbols-outlined` }, this.separator))))))))));
    }
    static get is() { return "dda-breadcrumb"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-breadcrumb.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-breadcrumb.css", "../../global/global.css"]
        };
    }
    static get properties() {
        return {
            "design": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'text' | 'icon-text' | 'icon'",
                    "resolved": "\"icon\" | \"icon-text\" | \"text\"",
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
                "defaultValue": "'text'"
            },
            "separator": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'chevron_right' | 'pen_size_2'",
                    "resolved": "\"chevron_right\" | \"pen_size_2\"",
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
                "attribute": "separator",
                "reflect": false,
                "defaultValue": "'chevron_right'"
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
    static get elementRef() { return "el"; }
}
//# sourceMappingURL=dda-breadcrumb.js.map
