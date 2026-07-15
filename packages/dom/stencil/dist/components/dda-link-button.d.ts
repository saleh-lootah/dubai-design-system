import type { Components, JSX } from "../types/components";

interface DdaLinkButton extends Components.DdaLinkButton, HTMLElement {}
export const DdaLinkButton: {
    prototype: DdaLinkButton;
    new (): DdaLinkButton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
