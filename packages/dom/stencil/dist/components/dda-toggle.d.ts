import type { Components, JSX } from "../types/components";

interface DdaToggle extends Components.DdaToggle, HTMLElement {}
export const DdaToggle: {
    prototype: DdaToggle;
    new (): DdaToggle;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
