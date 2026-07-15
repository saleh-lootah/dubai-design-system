import { h } from "@stencil/core";
export class DdaStickyFooter {
    constructor() {
        this.isHidden = false;
        this.lastScrollY = 0;
    }
    componentWillLoad() {
        this.handleScroll = this.handleScroll.bind(this);
    }
    componentDidLoad() {
        window.addEventListener('scroll', this.handleScroll);
    }
    disconnectedCallback() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    handleScroll() {
        const currentScrollY = window.scrollY;
        this.isHidden = currentScrollY > this.lastScrollY;
        this.lastScrollY = currentScrollY;
    }
    render() {
        return (h("footer", { key: 'f0accbe1fb4852ecb1bb7a7aea13c4e669693a0c', class: { 'dda-footer': true, 'hidden': this.isHidden } }, h("div", { key: 'db29b6a46150c80510393d291036faca180b313e', class: "footer-content" }, h("div", { key: '585186750d4cd31ea02120b7808814ab356082ef', class: "dda-footer-item dda-footer-left" }, h("ul", { key: '40f15debba97ea8136d7d8ba18325d91697d6924' }, h("li", { key: '47f73ad1b1bab41a13717e19bc780120b95c259e', class: "foot-icon-btn" }, h("dda-tooltip", { key: '7ac1423e960b6bd9f1ca7a87f22aa86cf36e72dd', title_text: this.happinessIconTooltip, description: "", position: "top" }, h("a", { key: 'c7ac8e91794e386c444a7e8c6ffbd926d866c41d', href: this.happinessIconHref }, h("img", { key: '205a13739903df14f3df77c90dd51249c9dc558e', src: this.happinessIconSrc, alt: this.happinessIconAlt })))), h("li", { key: '1aaf8660401633d3fe06d3491c04ab3801042e49', class: "foot-icon-btn" }, h("dda-tooltip", { key: '70f5970331f34718188c07f8787d1481520b3b35', title_text: this.accessibilityIconTooltip, description: "", position: "top" }, h("a", { key: '517500e2356374f9a696bd7c22a9dae11bb4d673', href: this.accessibilityIconHref }, h("img", { key: 'd5fea6abf65ca4d9aa236b26459783d3a2e36708', src: this.accessibilityIconSrc, alt: this.accessibilityIconAlt })))), h("li", { key: '0fce2d2122f3ab31fb335b56180eebd885a94c6e', class: "foot-icon-btn" }, h("dda-tooltip", { key: '2a751de0116bf7c06e6f4eaf362d7a9a3fe72045', title_text: this.servicesIconTooltip, description: "", position: "top" }, h("a", { key: 'a336dc7c0706e3c20f7cc28956239f728863f1bf', href: this.servicesIconHref }, h("img", { key: '693f719ae06b2e048d8dd9fd2563cf2a66058665', src: this.servicesIconSrc, alt: this.servicesIconAlt }), this.servicesIconText && h("span", { key: 'b10982f36a8f87df6052483f113d18a6dd0eab80' }, this.servicesIconText)))))), this.hideMiddleSection == false && (h("div", { key: '7d8c2044b8b77d42e5af5da526f76ebb83d7a41c', class: "dda-footer-item dda-footer-middle" }, h("ul", { key: 'ee1ec72d5bd2a29b2d8cdac68970f62b4389933c', class: "foot-logo" }, h("li", { key: '0bb94e8b10f649f33753ccf7a5e1527b0721987e' }, h("dda-tooltip", { key: 'e8d57fa4799d72ac4023e237e20b0f92982f1b63', title_text: this.firstLogoTooltip, description: "", position: "top" }, h("a", { key: 'fc0413d8839efcab1cd3eaad15266b20a76e974a', href: this.firstLogoHref }, h("img", { key: 'a543cc9c683a70f1c18de53de05dfd0862318b18', src: this.firstLogoSrc, alt: this.firstLogoAlt })))), h("li", { key: '01722dc9976ca1008436da880d2d88766898dbd5' }, h("dda-tooltip", { key: '24a7591f8214ec40e0ca661b133f4c8a398d4e06', title_text: this.secondLogoTooltip, description: "", position: "top" }, h("a", { key: '8bc91c27390fdb724db3bcc58de0245936b4f42d', href: this.secondLogoHref }, h("img", { key: 'bea2a49cd68d792e664d050c5b122b6aaa7024b5', src: this.secondLogoSrc, alt: this.secondLogoAlt })))), h("li", { key: '447c5abebd618af16ab921509805775949063ce7' }, h("dda-tooltip", { key: 'e1e3187e094e0a6ca98aa5bfda7b26d84864f1f1', title_text: this.thirdLogoTooltip, description: "", position: "top" }, h("a", { key: '8390ae19866ffe03bd03d5b9b0a3a33fb2277e62', href: this.thirdLogoHref }, h("img", { key: '881736f2c4cf1a85de12bf49a0dcae0114f245d2', src: this.thirdLogoSrc, alt: this.thirdLogoAlt }))))))), h("div", { key: '26402942e4c9ada64ff5097d652f1287a63a615f', class: "dda-footer-item dda-footer-right" }, h("ul", { key: 'd8327f535544dc025fc23a5a8a2aafd5dda3eebb' }, h("li", { key: 'f0a81e2f716026e2163b5f1975ce21996fbb4a9b', class: "foot-icon-btn" }, h("dda-tooltip", { key: 'eec887f9cee4babfe06f5b1e8d607ad669e6d8fe', title_text: this.locationButtonText, description: "", position: "top" }, h("a", { key: '3f0c3aa7fca0d2ab083e44fce564c5e1f03b5e30', href: this.locationButtonHref }, h("img", { key: '49e27c63e549ff9fd1d2b3f77570d523b092bb42', src: this.locationLogoSrc, alt: this.locationButtonText })))), h("li", { key: 'a0d85482c29e2383157ac5865405408de60fb5e2', class: "foot-icon-btn" }, h("dda-tooltip", { key: '524959226897e007766508edf29da3eb61d9ecd5', title_text: this.newsButtonText, description: "", position: "top" }, h("a", { key: 'fc45332f426c642f192bc80068c0035131e03b9e', href: this.newsButtonHref }, h("img", { key: '63284ebefaa19416aff7f626e69ff1d51f6e6bf9', src: this.newsButtonSrc, alt: this.newsButtonText })))), h("li", { key: '8285a1c84ce16656b73c52ad0abe10bd12ff6a5a', class: "foot-icon-btn" }, h("dda-tooltip", { key: '696f6528c046f1335844d27982db1d6ccc5f0705', title_text: this.aiIconTooltip, description: "", position: "top" }, h("a", { key: '286655941fd03e409ecaa16d12a46a787fbfab55', href: this.aiIconHref }, h("img", { key: 'd20f80edec9663c8c8cb6f0c6835efe9bca0f8e0', src: this.aiIconSrc, alt: this.aiIconAlt })))), h("li", { key: 'f4cd5732a043051d7c51496d07a2572f279c36ac', class: "foot-icon-btn" }, h("dda-tooltip", { key: 'f4baeac9c675c6e6f2f9be25b55d29de7ac4bfcc', title_text: this.chatIconTooltip, description: "", position: "top" }, h("a", { key: 'c408bf15899d2481f87f285d5af8f9c6babccd7b', href: this.chatIconHref }, h("img", { key: '9d4db40451b51812380cf69fdf41de8c8008d1c0', src: this.chatIconSrc, alt: this.chatIconAlt })))))))));
    }
    static get is() { return "dda-sticky-footer"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["dda-sticky-footer.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["dda-sticky-footer.css"]
        };
    }
    static get properties() {
        return {
            "happinessIconHref": {
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
                    "text": "Left Section Props"
                },
                "getter": false,
                "setter": false,
                "attribute": "happiness-icon-href",
                "reflect": false
            },
            "happinessIconSrc": {
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
                "attribute": "happiness-icon-src",
                "reflect": false
            },
            "happinessIconAlt": {
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
                "attribute": "happiness-icon-alt",
                "reflect": false
            },
            "happinessIconTooltip": {
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
                "attribute": "happiness-icon-tooltip",
                "reflect": false
            },
            "accessibilityIconHref": {
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
                "attribute": "accessibility-icon-href",
                "reflect": false
            },
            "accessibilityIconSrc": {
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
                "attribute": "accessibility-icon-src",
                "reflect": false
            },
            "accessibilityIconAlt": {
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
                "attribute": "accessibility-icon-alt",
                "reflect": false
            },
            "accessibilityIconTooltip": {
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
                "attribute": "accessibility-icon-tooltip",
                "reflect": false
            },
            "servicesIconHref": {
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
                "attribute": "services-icon-href",
                "reflect": false
            },
            "servicesIconSrc": {
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
                "attribute": "services-icon-src",
                "reflect": false
            },
            "servicesIconAlt": {
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
                "attribute": "services-icon-alt",
                "reflect": false
            },
            "servicesIconTooltip": {
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
                "attribute": "services-icon-tooltip",
                "reflect": false
            },
            "servicesIconText": {
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
                "attribute": "services-icon-text",
                "reflect": false
            },
            "firstLogoHref": {
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
                    "text": "Middle Section Props"
                },
                "getter": false,
                "setter": false,
                "attribute": "first-logo-href",
                "reflect": false
            },
            "firstLogoSrc": {
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
                "attribute": "first-logo-src",
                "reflect": false
            },
            "firstLogoAlt": {
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
                "attribute": "first-logo-alt",
                "reflect": false
            },
            "firstLogoTooltip": {
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
                "attribute": "first-logo-tooltip",
                "reflect": false
            },
            "secondLogoHref": {
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
                "attribute": "second-logo-href",
                "reflect": false
            },
            "secondLogoSrc": {
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
                "attribute": "second-logo-src",
                "reflect": false
            },
            "secondLogoAlt": {
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
                "attribute": "second-logo-alt",
                "reflect": false
            },
            "secondLogoTooltip": {
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
                "attribute": "second-logo-tooltip",
                "reflect": false
            },
            "thirdLogoHref": {
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
                "attribute": "third-logo-href",
                "reflect": false
            },
            "thirdLogoSrc": {
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
                "attribute": "third-logo-src",
                "reflect": false
            },
            "thirdLogoAlt": {
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
                "attribute": "third-logo-alt",
                "reflect": false
            },
            "thirdLogoTooltip": {
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
                "attribute": "third-logo-tooltip",
                "reflect": false
            },
            "locationButtonHref": {
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
                    "text": "Right Section Props"
                },
                "getter": false,
                "setter": false,
                "attribute": "location-button-href",
                "reflect": false
            },
            "locationLogoSrc": {
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
                "attribute": "location-logo-src",
                "reflect": false
            },
            "locationButtonText": {
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
                "attribute": "location-button-text",
                "reflect": false
            },
            "locationButtonIcon": {
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
                "attribute": "location-button-icon",
                "reflect": false
            },
            "newsButtonHref": {
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
                "attribute": "news-button-href",
                "reflect": false
            },
            "newsButtonSrc": {
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
                "attribute": "news-button-src",
                "reflect": false
            },
            "newsButtonText": {
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
                "attribute": "news-button-text",
                "reflect": false
            },
            "newsButtonIcon": {
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
                "attribute": "news-button-icon",
                "reflect": false
            },
            "aiIconHref": {
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
                "attribute": "ai-icon-href",
                "reflect": false
            },
            "aiIconSrc": {
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
                "attribute": "ai-icon-src",
                "reflect": false
            },
            "aiIconAlt": {
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
                "attribute": "ai-icon-alt",
                "reflect": false
            },
            "aiIconTooltip": {
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
                "attribute": "ai-icon-tooltip",
                "reflect": false
            },
            "chatIconHref": {
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
                "attribute": "chat-icon-href",
                "reflect": false
            },
            "chatIconSrc": {
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
                "attribute": "chat-icon-src",
                "reflect": false
            },
            "chatIconAlt": {
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
                "attribute": "chat-icon-alt",
                "reflect": false
            },
            "chatIconTooltip": {
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
                "attribute": "chat-icon-tooltip",
                "reflect": false
            },
            "hideMiddleSection": {
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
                "attribute": "hide-middle-section",
                "reflect": false
            }
        };
    }
    static get states() {
        return {
            "isHidden": {}
        };
    }
}
//# sourceMappingURL=dda-sticky-footer.js.map
