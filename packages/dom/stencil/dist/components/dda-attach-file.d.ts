import type { Components, JSX } from "../types/components";

interface DdaAttachFile extends Components.DdaAttachFile, HTMLElement {}
export const DdaAttachFile: {
    prototype: DdaAttachFile;
    new (): DdaAttachFile;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
