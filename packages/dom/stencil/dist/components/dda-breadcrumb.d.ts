import type { Components, JSX } from "../types/components";

interface DdaBreadcrumb extends Components.DdaBreadcrumb, HTMLElement {}
export const DdaBreadcrumb: {
    prototype: DdaBreadcrumb;
    new (): DdaBreadcrumb;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
