import type { Components, JSX } from "../types/components";

interface DdaCheckbox extends Components.DdaCheckbox, HTMLElement {}
export const DdaCheckbox: {
    prototype: DdaCheckbox;
    new (): DdaCheckbox;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
