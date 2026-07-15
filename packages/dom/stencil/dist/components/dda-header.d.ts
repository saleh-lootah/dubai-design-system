import type { Components, JSX } from "../types/components";

interface DdaHeader extends Components.DdaHeader, HTMLElement {}
export const DdaHeader: {
    prototype: DdaHeader;
    new (): DdaHeader;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
