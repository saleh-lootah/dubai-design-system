import type { Components, JSX } from "../types/components";

interface DdaCreditcardField extends Components.DdaCreditcardField, HTMLElement {}
export const DdaCreditcardField: {
    prototype: DdaCreditcardField;
    new (): DdaCreditcardField;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
