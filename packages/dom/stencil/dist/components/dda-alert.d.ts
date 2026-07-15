import type { Components, JSX } from "../types/components";

interface DdaAlert extends Components.DdaAlert, HTMLElement {}
export const DdaAlert: {
    prototype: DdaAlert;
    new (): DdaAlert;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
