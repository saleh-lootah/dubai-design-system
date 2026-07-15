import type { Components, JSX } from "../types/components";

interface DdaUiCard extends Components.DdaUiCard, HTMLElement {}
export const DdaUiCard: {
    prototype: DdaUiCard;
    new (): DdaUiCard;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
