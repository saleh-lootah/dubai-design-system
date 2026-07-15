import type { Components, JSX } from "../types/components";

interface DdaTabs extends Components.DdaTabs, HTMLElement {}
export const DdaTabs: {
    prototype: DdaTabs;
    new (): DdaTabs;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
