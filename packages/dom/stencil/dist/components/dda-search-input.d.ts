import type { Components, JSX } from "../types/components";

interface DdaSearchInput extends Components.DdaSearchInput, HTMLElement {}
export const DdaSearchInput: {
    prototype: DdaSearchInput;
    new (): DdaSearchInput;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
