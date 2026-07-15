import type { Components, JSX } from "../types/components";

interface DdaBanner extends Components.DdaBanner, HTMLElement {}
export const DdaBanner: {
    prototype: DdaBanner;
    new (): DdaBanner;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
