import type { Components, JSX } from "../types/components";

interface DdaHomeBanner extends Components.DdaHomeBanner, HTMLElement {}
export const DdaHomeBanner: {
    prototype: DdaHomeBanner;
    new (): DdaHomeBanner;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
