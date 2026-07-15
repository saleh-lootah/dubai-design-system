import type { Components, JSX } from "../types/components";

interface DdaTooltip extends Components.DdaTooltip, HTMLElement {}
export const DdaTooltip: {
    prototype: DdaTooltip;
    new (): DdaTooltip;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
