import type { Components, JSX } from "../types/components";

interface DdaHorizontalStepper extends Components.DdaHorizontalStepper, HTMLElement {}
export const DdaHorizontalStepper: {
    prototype: DdaHorizontalStepper;
    new (): DdaHorizontalStepper;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
