import type { Components, JSX } from "../types/components";

interface DdaRadiobutton extends Components.DdaRadiobutton, HTMLElement {}
export const DdaRadiobutton: {
    prototype: DdaRadiobutton;
    new (): DdaRadiobutton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
