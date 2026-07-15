import type { Components, JSX } from "../types/components";

interface DdaSelect extends Components.DdaSelect, HTMLElement {}
export const DdaSelect: {
    prototype: DdaSelect;
    new (): DdaSelect;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
