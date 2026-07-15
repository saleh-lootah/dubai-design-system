import type { Components, JSX } from "../types/components";

interface DdaNumberField extends Components.DdaNumberField, HTMLElement {}
export const DdaNumberField: {
    prototype: DdaNumberField;
    new (): DdaNumberField;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
