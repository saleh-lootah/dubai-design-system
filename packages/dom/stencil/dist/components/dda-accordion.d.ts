import type { Components, JSX } from "../types/components";

interface DdaAccordion extends Components.DdaAccordion, HTMLElement {}
export const DdaAccordion: {
    prototype: DdaAccordion;
    new (): DdaAccordion;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
