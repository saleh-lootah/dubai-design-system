import type { Components, JSX } from "../types/components";

interface DdaCreditCard extends Components.DdaCreditCard, HTMLElement {}
export const DdaCreditCard: {
    prototype: DdaCreditCard;
    new (): DdaCreditCard;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
