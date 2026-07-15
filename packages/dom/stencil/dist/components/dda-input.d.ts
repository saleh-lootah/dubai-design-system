import type { Components, JSX } from "../types/components";

interface DdaInput extends Components.DdaInput, HTMLElement {}
export const DdaInput: {
    prototype: DdaInput;
    new (): DdaInput;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
