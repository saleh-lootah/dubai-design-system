import type { Components, JSX } from "../types/components";

interface DdaTextarea extends Components.DdaTextarea, HTMLElement {}
export const DdaTextarea: {
    prototype: DdaTextarea;
    new (): DdaTextarea;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
