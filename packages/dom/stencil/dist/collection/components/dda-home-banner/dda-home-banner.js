import { Host, h } from "@stencil/core";
export class DdaHomeBanner {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
    }
    componentDidLoad() {
        this.updateSlides();
        // Listen for slot changes
        const slot = this.el.querySelector('slot');
        slot === null || slot === void 0 ? void 0 : slot.addEventListener('slotchange', () => this.updateSlides());
    }
    updateSlides() {
        this.slides = Array.from(this.el.querySelectorAll('slide'));
        if (this.slides.length > 0) {
            this.currentSlide = 0; // Reset slide index if slides are updated
        }
    }
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    }
    setSlide(index) {
        this.currentSlide = index;
    }
    render() {
        return (h(Host, { key: '0994ad4b5b0f8be0b1c9bc7f438e9cd53220e141' }, h("div", { key: '4bde6f06bcfa26527f9cf5fe8f36257091d9058a', class: "dda-slider-container" }, h("div", { key: '37f99d769bcfee11674d497d8f60e018b9eb0a4c', class: "dda-slides", style: { innerWidth: this.slides.length * 100 + 'vw', left: this.currentSlide * -100 + '%' } }, h("slot", { key: 'ce3a86b7e12486df6ecb8d9c8e66ca35e82bb283' })), h("div", { key: 'ab5c33a69bbfdfc526ed93f97fdb38a97d7e37b6', class: 'slider-nav' }, h("button", { key: '0cc09f7b4be19e681c443f60a8d63b3e707dbdcc', class: "prev", onClick: () => this.prevSlide() }, h("i", { key: 'b386199a011cac6368e9839cff0992a66efa6b30', class: "material-icons" }, "chevron_left")), h("ul", { key: '0cffee11986e29e14a12dc95b10a4a858b8bdcfd' }, this.slides.map((_, index) => {
            return h("div", { class: this.currentSlide == index ? 'dots active' : 'dots', onClick: () => this.setSlide(index) });
        })), h("button", { key: '22209fd8768420690951dde0fdf23258ebefa6c5', class: "next", onClick: () => this.nextSlide() }, h("i", { key: '4ba434a9417531f89a8ac24090c4fc95542685fa', class: "material-icons" }, "chevron_right"))))));
    }
    static get is() { return "dda-home-banner"; }
    static get originalStyleUrls() {
        return {
            "$": ["home-banner.css", "../../global/global.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["home-banner.css", "../../global/global.css"]
        };
    }
    static get states() {
        return {
            "currentSlide": {}
        };
    }
    static get elementRef() { return "el"; }
}
//# sourceMappingURL=dda-home-banner.js.map
