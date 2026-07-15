import type { Components, JSX } from "../types/components";

interface DdaSegmentedTabs extends Components.DdaSegmentedTabs, HTMLElement {}
export const DdaSegmentedTabs: {
    prototype: DdaSegmentedTabs;
    new (): DdaSegmentedTabs;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
