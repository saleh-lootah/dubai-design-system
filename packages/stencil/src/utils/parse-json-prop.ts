// Reads a prop that takes a list: a JSON string from an HTML attribute, or an array that a
// framework wrapper sets as a property. A bad value must never stop the component rendering,
// so it gives an empty list and one warning that names the attribute. Entries that are not plain
// objects (null, a number, a string, an array) are dropped, also with one warning, so that the
// component never reads a field of a non-object.
export function parseJsonProp<T>(value: unknown, propName: string): T[] {
  if (value === undefined || value === null || value === '') return [];
  if (Array.isArray(value)) return objectsOnly<T>(value, propName);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return objectsOnly<T>(parsed, propName);
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

const isPlainObject = (entry: unknown): boolean => entry !== null && typeof entry === 'object' && !Array.isArray(entry);

// Returns the same array when every entry is an object, so an array property stays unchanged.
function objectsOnly<T>(list: unknown[], propName: string): T[] {
  if (list.every(isPlainObject)) return list as T[];
  console.warn(`${propName}: an item is not an object; it is ignored.`);
  return list.filter(isPlainObject) as T[];
}
