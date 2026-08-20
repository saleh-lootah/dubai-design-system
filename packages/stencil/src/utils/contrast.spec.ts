import { contrastRatio, parseRgb, relativeLuminance } from './contrast';

// Sanity-checks contrast.ts's math against the hand-computed figures in
// docs/a11y/contrast-decision.md, so a bug in the helper itself can't make
// every F-023 e2e assertion pass for the wrong reason.
describe('contrast helper', () => {
  it('parses an rgb() computed-style string', () => {
    expect(parseRgb('rgb(91, 95, 94)')).toEqual({ r: 91, g: 95, b: 94 });
  });

  it('parses an rgba() computed-style string, ignoring alpha', () => {
    expect(parseRgb('rgba(91, 95, 94, 0.5)')).toEqual({ r: 91, g: 95, b: 94 });
  });

  it('computes 21:1 for black on white', () => {
    expect(contrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)')).toBeCloseTo(21, 1);
  });

  it('computes 1:1 for identical colors', () => {
    expect(contrastRatio('rgb(128, 128, 128)', 'rgb(128, 128, 128)')).toBeCloseTo(1, 5);
  });

  it('is order-independent', () => {
    const a = contrastRatio('rgb(91, 95, 94)', 'rgb(255, 255, 255)');
    const b = contrastRatio('rgb(255, 255, 255)', 'rgb(91, 95, 94)');
    expect(a).toBeCloseTo(b, 10);
  });

  it('matches the decision record: #5B5F5E on white is 6.47:1', () => {
    expect(contrastRatio('rgb(91, 95, 94)', 'rgb(255, 255, 255)')).toBeCloseTo(6.47, 1);
  });

  it('matches the decision record: #A9ACAB on #191C1C is 7.50:1', () => {
    expect(contrastRatio('rgb(169, 172, 171)', 'rgb(25, 28, 28)')).toBeCloseTo(7.5, 1);
  });

  it('relativeLuminance is 0 for black and 1 for white', () => {
    expect(relativeLuminance(parseRgb('rgb(0,0,0)'))).toBe(0);
    expect(relativeLuminance(parseRgb('rgb(255,255,255)'))).toBe(1);
  });
});
