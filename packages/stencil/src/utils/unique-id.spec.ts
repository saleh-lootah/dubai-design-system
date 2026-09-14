import { uniqueId } from './unique-id';

describe('uniqueId', () => {
  it('returns a different id on every call, with the prefix', () => {
    const first = uniqueId('dda-input');
    const second = uniqueId('dda-input');

    expect(first).toMatch(/^dda-input-\d+$/);
    expect(second).not.toBe(first);
  });
});
