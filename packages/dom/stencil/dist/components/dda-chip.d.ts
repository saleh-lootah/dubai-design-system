import type { Components, JSX } from "../types/components";

interface DdaChip extends Components.DdaChip, HTMLElement {}
export const DdaChip: {
    prototype: DdaChip;
    new (): DdaChip;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
