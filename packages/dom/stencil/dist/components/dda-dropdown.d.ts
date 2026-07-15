import type { Components, JSX } from "../types/components";

interface DdaDropdown extends Components.DdaDropdown, HTMLElement {}
export const DdaDropdown: {
    prototype: DdaDropdown;
    new (): DdaDropdown;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
