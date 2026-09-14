let counter = 0;

/**
 * Returns an id that is unique on the page, for elements such as a label's input when the
 * consumer did not pass one. Call it once per component instance (as a field initializer),
 * so the id stays stable across renders.
 */
export function uniqueId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
