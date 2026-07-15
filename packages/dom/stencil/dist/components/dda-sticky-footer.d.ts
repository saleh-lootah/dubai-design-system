import type { Components, JSX } from "../types/components";

interface DdaStickyFooter extends Components.DdaStickyFooter, HTMLElement {}
export const DdaStickyFooter: {
    prototype: DdaStickyFooter;
    new (): DdaStickyFooter;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
