import { r as registerInstance, c as createEvent, h, H as Host } from './index-ec5a309d.js';

const ddaUiCardCss = ":host{display:block}";
const DdaUiCardStyle0 = ddaUiCardCss;

const DdaUiCard = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.linkClick = createEvent(this, "linkClick", 7);
        this.type = 'default';
        this.icon = '';
        this.image = '';
        this.maintitle = '';
        this.subtitle = '';
        this.link = '';
        this.linktext = '';
        this.linkicon = 'arrow_forward';
    }
    render() {
        return (h(Host, { key: '30c63ed62e73c8cc2450bf87e68696fa75d2ffa9' }, h("div", { key: '84b0ee5cd11c08b8ce4f255984686522d18a0e21', class: 'dda-card' }, h("div", { key: '8dbd4052cf9f65ecbee0564f3053451b51f97f4c', class: 'dda-card-body' }, this.type !== 'custom' && (h("div", { key: '4d19b37ed54d7750502d0d887e8f3e176e29032e' }, !!this.icon && (h("span", { key: '57208d2990bedd1a9f2aee6bb98d92bce8040705', class: 'dda-card-icon' }, h("i", { key: 'e75ebb8cbfb0c6f01b671578b506b2f0f28643d5', class: 'material-icons' }, this.icon))), !!this.image && (h("span", { key: 'dc779d3cff58242aee5d793f891e6690976729e9', class: 'dda-card-icon' }, h("img", { key: '00412adf49dbdb05f82fb8ae84b211325b2716e3', src: this.image, alt: this.maintitle }))), !!this.maintitle && h("h1", { key: 'fff43c9f0ef550aac34817bed2712e1fa570ed01', class: 'dda-card-title' }, this.maintitle), !!this.subtitle && h("p", { key: 'a9e3e53004c78dae194808dad1611d0267860ef1', class: 'dda-card-text-muted' }, this.subtitle), !!this.link && (h("a", { key: '2d16d8feab0e3162eecabeb0b52048a0a6251281', href: this.link, class: 'dda-card-link' }, this.linktext, ' ', this.linkicon && (h("span", { key: '9d99219b356886256f5e2c81cb9b393d2fea4626' }, h("i", { key: '4a54cfe82b308866a7b6dfab353035da852c6d0a', class: 'material-icons' }, this.linkicon))))))), h("slot", { key: 'b8861e92d81fcb83f2dd4a5eb1eaed2726dd5932' })))));
    }
};
DdaUiCard.style = DdaUiCardStyle0;

export { DdaUiCard as dda_ui_card };

//# sourceMappingURL=dda-ui-card.entry.js.map