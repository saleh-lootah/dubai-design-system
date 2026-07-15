import type { Components, JSX } from "../types/components";

interface DdaFooter extends Components.DdaFooter, HTMLElement {}
export const DdaFooter: {
    prototype: DdaFooter;
    new (): DdaFooter;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
