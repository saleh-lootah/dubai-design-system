// F-023: shared test helper for asserting the *contrast outcome* of a
// foreground/background pairing, not the CSS custom property name behind it.
// Not consumed by any component — used only from e2e specs, which read real
// `getComputedStyle()` color strings (e.g. "rgb(94, 96, 95)") from a
// rendered page and pass them here.

interface Rgb {
  r: number;
  g: number;
  b: number;
}

/**
 * Parses a CSS color string as returned by `getComputedStyle()`
 * (`rgb(r, g, b)` or `rgba(r, g, b, a)`) into its channel values.
 */
export function parseRgb(color: string): Rgb {
  const match = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (!match) {
    throw new Error(`contrast.ts: could not parse computed color "${color}"`);
  }
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
}

function channelLuminance(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance({ r, g, b }: Rgb): number {
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/**
 * WCAG contrast ratio between two colors, each either a `getComputedStyle()`
 * color string or a pre-parsed { r, g, b }. Order doesn't matter — the
 * lighter color is always treated as the numerator, per spec.
 */
export function contrastRatio(a: string | Rgb, b: string | Rgb): number {
  const rgbA = typeof a === 'string' ? parseRgb(a) : a;
  const rgbB = typeof b === 'string' ? parseRgb(b) : b;
  const lumA = relativeLuminance(rgbA);
  const lumB = relativeLuminance(rgbB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}
