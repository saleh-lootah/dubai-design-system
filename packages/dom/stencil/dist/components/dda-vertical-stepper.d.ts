import type { Components, JSX } from "../types/components";

interface DdaVerticalStepper extends Components.DdaVerticalStepper, HTMLElement {}
export const DdaVerticalStepper: {
    prototype: DdaVerticalStepper;
    new (): DdaVerticalStepper;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
