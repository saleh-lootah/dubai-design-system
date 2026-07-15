import type { Components, JSX } from "../types/components";

interface DdaAvatar extends Components.DdaAvatar, HTMLElement {}
export const DdaAvatar: {
    prototype: DdaAvatar;
    new (): DdaAvatar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
