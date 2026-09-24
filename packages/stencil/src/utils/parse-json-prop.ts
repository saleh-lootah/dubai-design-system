// Reads a prop that takes a list: a JSON string from an HTML attribute, or an array that a
// framework wrapper sets as a property. A bad value must never stop the component rendering,
// so it gives an empty list and one warning that names the attribute.
export function parseJsonProp<T>(value: unknown, propName: string): T[] {
  if (value === undefined || value === null || value === '') return [];
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed as T[];
      console.warn(`${propName}: expected a JSON array; the value is ignored.`);
      return [];
    } catch {
      console.warn(`${propName}: the value is not valid JSON; it is ignored.`);
      return [];
    }
  }
  console.warn(`${propName}: expected a JSON array; the value is ignored.`);
  return [];
}
