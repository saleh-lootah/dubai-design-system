import type { Components, JSX } from "../types/components";

interface DdaProgressbar extends Components.DdaProgressbar, HTMLElement {}
export const DdaProgressbar: {
    prototype: DdaProgressbar;
    new (): DdaProgressbar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
