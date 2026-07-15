import { r as registerInstance, h } from './index-ec5a309d.js';

const ddaFooterCss = "";
const DdaFooterStyle0 = ddaFooterCss;

const DdaFooter = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    parseJsonArray(jsonString) {
        try {
            return JSON.parse(jsonString);
        }
        catch (e) {
            console.error('Failed to parse JSON:', e);
            return [];
        }
    }
    render() {
        const sections = this.parseJsonArray(this.footerSections);
        const icons = this.parseJsonArray(this.socialIcons);
        return (h("footer", { key: '1ee5864816101d3c8d76118a34c4d3ba648dcdfc', class: "WB-footer" }, h("div", { key: 'cc44f55919be5e275484242901108fce2474625f', class: "dda-container line-seperater" }, h("div", { key: 'b8b8f3ed537154fb3c24d6fea2961002298b4d3c', class: "dda-flex dda-align-center flex-column dda-gap-5" }, h("h4", { key: '2ba7fa4d5d3b0f0a3b3e3fed3ec569a1c9c170f4', class: "dda-fs-display-sm dda-fw-700 dda-color-black" }, this.footerTitle), h("p", { key: 'd415e59a372ef228afaf2ad1e74e1e033edc7611', class: "dda-fs-title-sm dda-fw-400 mb-3" }, this.description), h("div", { key: 'ef3cbb753a0c2fcf494f3fa6746392324d900753', class: "dda-flex dda-gap-5" }, h("dda-button", { key: 'dc6e5c571ef587b0d1c4d877be2ef009f3407b81', button_color: "default-primary", size: "lg" }, this.signUpButtonText), h("dda-button", { key: '08596607ed057622798eed6a27ec0266041908c0', button_color: "default-tertiary", size: "lg" }, this.loginButtonText)))), h("div", { key: '97bdd2e2f86c0ebb3217aa7edf14d578a54c9894', class: "dda-container line-seperater" }, h("div", { key: '01bee8a52aa0099c8d88ca50ba399dd24f8126a2', class: "dda-row" }, h("div", { key: 'e5895dfcb65e65e294771d0bebd35ad0ee799ac6', class: "dda-col-lg-4 mb-3" }, h("div", { key: 'e641c6fb1f7d0f3ea9f2383ea4a32299d1ec4d48', class: "text-center" }, h("img", { key: '3ea2c13f5f68e15eaff8301ec597429bc381c1ac', class: "entt-logo", src: this.logoSrc, alt: this.logoAlt }), h("p", { key: '06d6254dbf83ab8d8f0bf4ea310f7d2b624dedf1', class: "dda-fs-title-sm" }, "Design outstanding interfaces with advanced Figma features in a matter of minutes."))), h("div", { key: 'f09e12b02fe50b02c6b7af9e6d9504a90d43204b', class: "dda-col-lg-8" }, h("div", { key: '50386a6be8b049a1a95ad1cfb0ad1ed845176d75', class: "dda-row" }, sections.map((section) => (h("div", { class: "dda-col-6 dda-col-sm-6 dda-col-md-3 mb-3" }, h("p", { class: "dda-fs-title-sm dda-fw-700 dda-color-black mb-3" }, section.title), h("ul", { class: "footer-menu" }, section.links.map((link) => (h("li", null, h("a", { class: "dda-fs-title-sm dda-fw-400", href: link.href }, link.label)))))))))))), h("div", { key: '93aba0a00de9530733f6a18320555fce984365eb', class: "dda-container pt-4" }, h("div", { key: '0f5a6c03a9a503f5144d42a92cef25f74cfeeb7d', class: "dda-flex dda-align-center dda-justify-space" }, h("p", { key: 'dbcf534eac12d93617bb1af84ce580e4c3a601ee', class: "dda-fs-title-sm" }, this.copyrightText), h("ul", { key: '0ca4449a88cfa166b6fb99cf2dc23357e82ec897', class: "dda-flex dda-align-center dda-gap-4" }, icons.map((icon) => (h("li", null, h("a", { href: icon.href }, h("img", { class: "footer-social-icn", src: icon.src, alt: icon.alt }))))))))));
    }
};
DdaFooter.style = DdaFooterStyle0;

export { DdaFooter as dda_footer };

//# sourceMappingURL=dda-footer.entry.js.map