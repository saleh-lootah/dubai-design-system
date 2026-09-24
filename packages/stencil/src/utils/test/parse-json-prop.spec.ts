import { parseJsonProp } from '../parse-json-prop';

describe('parseJsonProp', () => {
  let warn: jest.SpyInstance;
  beforeEach(() => (warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined)));
  afterEach(() => warn.mockRestore());

  it('parses a JSON array string', () => {
    expect(parseJsonProp('[{"a":1}]', 'x')).toEqual([{ a: 1 }]);
  });

  it('returns an array property unchanged', () => {
    const list = [{ a: 1 }];
    expect(parseJsonProp(list, 'x')).toBe(list);
  });

  it('returns [] without a warning when the prop is not set', () => {
    expect(parseJsonProp(undefined, 'x')).toEqual([]);
    expect(parseJsonProp(null, 'x')).toEqual([]);
    expect(parseJsonProp('', 'x')).toEqual([]);
    expect(warn).not.toHaveBeenCalled();
  });

  it('warns once and returns [] for invalid JSON', () => {
    expect(parseJsonProp('[{', 'middle-link')).toEqual([]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('middle-link');
  });

  it('warns and returns [] for JSON that is not an array', () => {
    expect(parseJsonProp('{"a":1}', 'right-link')).toEqual([]);
    expect(warn).toHaveBeenCalledTimes(1);
  });
  it('drops array entries that are not plain objects, with one warning that names the prop', () => {
    expect(parseJsonProp('[{"a":1},null,5,"x",[1],true]', 'middle-link')).toEqual([{ a: 1 }]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('middle-link');
  });

  it('drops bad entries from an array property too', () => {
    expect(parseJsonProp([null, { a: 1 }, 'x'], 'bannercardlist')).toEqual([{ a: 1 }]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('bannercardlist');
  });

  it('warns and returns [] for a value that is neither a string nor an array', () => {
    expect(parseJsonProp(42, 'right-link')).toEqual([]);
    expect(parseJsonProp({ a: 1 }, 'right-link')).toEqual([]);
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.mock.calls[0][0]).toContain('right-link');
  });
});
