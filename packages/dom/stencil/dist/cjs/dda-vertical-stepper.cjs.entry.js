'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-bccc9e2f.js');

const ddaVerticalStepperCss = ".v-stepper-container{display:flex;flex-direction:column;align-items:flex-start;width:100%}.v-step{display:flex;flex-wrap:wrap;position:relative;width:100%;background-color:transparent;border:solid 1px transparent;border-radius:16px}.v-step.active{background-color:var(--dda-surface-100);border:solid 1px var(--dda-color-primary-40);box-shadow:0px 10px 15px -3px rgba(16, 24, 40, 0.1)}.v-step .v-step-indicator{flex:0 0 auto;align-items:center;padding:15px;position:relative}.v-step .icon{width:30px;height:30px;background:var(--dda-surface-100);border-radius:30px;display:flex;justify-content:center;align-items:center;position:relative;z-index:2}.v-step-indicator::before{content:\"\";width:1px;height:100%;border-right:dashed 1px var(--dda-surface-variant-80);position:absolute;top:0px;left:50%;z-index:1;transform:translate(-50%, 0%)}.v-step.active .v-step-indicator::before{border-right:solid 1px var(--dda-color-primary-40)}.v-step.active .v-step-indicator::after{content:\"\";width:1px;height:30px;border-right:solid 1px var(--dda-color-primary-40);position:absolute;top:100%;left:50%;z-index:2;transform:translate(-50%, 0%)}.v-step .icon i{font-size:24px;color:var(--dda-on-surface-variant-30)}.v-step.active .icon i{color:var(--dda-color-primary-40)}.v-step .v-step-content{padding:15px 15px 15px 0;display:flex;flex-direction:column;flex:1}.v-step .v-step-title{font-size:18px;font-weight:var(--dda-fw-500)}.v-step .v-step-subtitle{font-size:14px;color:var(--dda-color-primary-40)}.v-step .v-step-description{font-size:14px;color:var(--dda-on-surface-variant-30)}.v-step-arrow{padding:15px;position:relative}.v-step-arrow i{position:absolute;left:5px;top:50%;transform:translate(0%, -50%);color:var(--dda-on-surface-variant-30)}";
const DdaVerticalStepperStyle0 = ddaVerticalStepperCss;

const DdaVerticalStepper = class {
    constructor(hostRef) {
        index.registerInstance(this, hostRef);
        this.current_Step = 0;
        this.custom_class = '';
        this.parsedSteps = [];
    }
    componentWillLoad() {
        this.parsedSteps = JSON.parse(this.steps);
    }
    render() {
        return (index.h(index.Host, { key: 'c24509092f39fb4757243a70743f98e49b26ff37' }, index.h("div", { key: 'e3fd0e75eefd0a3bf89998d495966af758df2419', class: `${this.custom_class} ${this.component_mode} v-stepper-container` }, this.parsedSteps.map((step, index$1) => (index.h("div", { class: `v-step ${index$1 <= this.current_Step ? 'active' : ''}` }, index.h("div", { class: "v-step-indicator" }, index.h("div", { class: "icon" }, index.h("i", { class: `material-icons` }, step.icon))), index.h("div", { class: "v-step-content" }, index.h("div", { class: "v-step-title" }, step.title), index.h("div", { class: "v-step-subtitle" }, step.subtitle), index.h("div", { class: "v-step-description" }, step.description)), index.h("div", { class: "v-step-arrow" }, index.h("i", { class: "material-icons  material-symbols-outlined" }, "chevron_right"))))))));
    }
};
DdaVerticalStepper.style = DdaVerticalStepperStyle0;

exports.dda_vertical_stepper = DdaVerticalStepper;

//# sourceMappingURL=dda-vertical-stepper.cjs.entry.js.map