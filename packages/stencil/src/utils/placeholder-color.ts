// Shared e2e helper for WCAG 1.4.3 placeholder-contrast specs. Not consumed
// by any component.
//
// Chromium's `getComputedStyle(input, '::placeholder')` returns the input's
// own `color`, not the placeholder's, so a spec cannot read the placeholder
// colour directly. This walks the page's stylesheets instead: it finds every
// `::placeholder` rule whose base selector matches the field, keeps the one
// that wins the cascade (highest specificity, then latest in source order),
// and resolves its `color` value (including `var()`) to a computed
// `rgb(...)` string that `contrastRatio()` can read.
//
// Pass the function itself to `page.evaluate()`. It runs in the browser, so
// it must stay self-contained: no imports, no closures, no async.

export interface PlaceholderColorArgs {
  /** Selector of the <input>/<textarea> that shows the placeholder. */
  field: string;
  /** Selector of the element that paints the background behind the placeholder. Defaults to `field`. */
  background?: string;
}

export function readPlaceholderColors(args: PlaceholderColorArgs): { placeholder: string; background: string } {
  const field = document.querySelector(args.field) as HTMLElement;
  const backgroundEl = document.querySelector(args.background || args.field) as HTMLElement;
  if (!field || !backgroundEl) {
    throw new Error(`placeholder-color.ts: no element for "${args.field}" or "${args.background}"`);
  }

  const specificity = (selector: string): number => {
    let rest = selector;
    const ids = (rest.match(/#[\w-]+/g) || []).length;
    rest = rest.replace(/#[\w-]+/g, ' ');
    const classes = (rest.match(/\.[\w-]+|\[[^\]]*\]|:[\w-]+/g) || []).length;
    rest = rest.replace(/\.[\w-]+|\[[^\]]*\]|:[\w-]+/g, ' ');
    const types = (rest.match(/[a-zA-Z][\w-]*/g) || []).length;
    return ids * 10000 + classes * 100 + types;
  };

  let bestValue = '';
  let bestSpecificity = -1;

  const visit = (rules: CSSRuleList) => {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i] as CSSRule & Partial<CSSImportRule & CSSStyleRule & CSSMediaRule>;
      if (rule.styleSheet && rule.styleSheet.cssRules) {
        visit(rule.styleSheet.cssRules);
      } else if (rule.selectorText !== undefined) {
        const value = rule.style.getPropertyValue('color');
        if (!value) continue;
        const parts = String(rule.selectorText).split(',');
        for (let j = 0; j < parts.length; j++) {
          const part = parts[j].trim();
          if (!/::placeholder$/.test(part)) continue;
          const base = part.replace(/::placeholder$/, '').trim() || '*';
          let matches = false;
          try {
            matches = field.matches(base);
          } catch {
            matches = false;
          }
          if (!matches) continue;
          const s = specificity(base);
          if (s >= bestSpecificity) {
            bestSpecificity = s;
            bestValue = value;
          }
        }
      } else if (rule.cssRules) {
        const media = rule.media ? rule.media.mediaText : '';
        if (!media || window.matchMedia(media).matches) {
          visit(rule.cssRules);
        }
      }
    }
  };

  for (let i = 0; i < document.styleSheets.length; i++) {
    let rules: CSSRuleList | null = null;
    try {
      rules = document.styleSheets[i].cssRules;
    } catch {
      rules = null;
    }
    if (rules) visit(rules);
  }

  // Resolve var()/keywords to rgb() in the field's own context.
  const probe = document.createElement('span');
  field.parentElement.appendChild(probe);
  probe.style.color = bestValue || getComputedStyle(field).color;
  const placeholder = getComputedStyle(probe).color;
  probe.remove();

  return { placeholder, background: getComputedStyle(backgroundEl).backgroundColor };
}
