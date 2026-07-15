import type { Components, JSX } from "../types/components";

interface DdaPhonefield extends Components.DdaPhonefield, HTMLElement {}
export const DdaPhonefield: {
    prototype: DdaPhonefield;
    new (): DdaPhonefield;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
