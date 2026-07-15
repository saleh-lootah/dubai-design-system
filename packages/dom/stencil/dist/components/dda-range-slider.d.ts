import type { Components, JSX } from "../types/components";

interface DdaRangeSlider extends Components.DdaRangeSlider, HTMLElement {}
export const DdaRangeSlider: {
    prototype: DdaRangeSlider;
    new (): DdaRangeSlider;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
