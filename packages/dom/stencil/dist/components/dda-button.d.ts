import type { Components, JSX } from "../types/components";

interface DdaButton extends Components.DdaButton, HTMLElement {}
export const DdaButton: {
    prototype: DdaButton;
    new (): DdaButton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
