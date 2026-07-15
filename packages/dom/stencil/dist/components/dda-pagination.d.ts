import type { Components, JSX } from "../types/components";

interface DdaPagination extends Components.DdaPagination, HTMLElement {}
export const DdaPagination: {
    prototype: DdaPagination;
    new (): DdaPagination;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
