import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

// The published packages must not point anyone at the source repository.
//
// `packages/stencil/package.json` ships CHANGELOG.md (see its `files` field), so every
// link written there goes out to every consumer on npm and the CDN. Release 5.0.1 shipped
// with twelve of them. Whether the repository is public is beside the point: the package
// is the product, the repository is not, and a published artifact should not advertise
// where it is developed or under whose account.
//
// Third-party URLs are fine and are deliberately NOT matched — `dist/` legitimately carries
// github.com references from Stencil's runtime and from Quill, which are vendor code we
// neither own nor rewrite. Only links to THIS project are a fault.
const REPO_URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_.-]+\/dubai-design-system/gi;

// `dist/` and `loader/` are generated from `src/`, so scanning source covers the built
// output without needing a build first — which is what lets this run in the lint job.
const SCAN_DIRS = ['src'];
const SCAN_FILES = ['CHANGELOG.md'];

// Text formats only. A binary match would be a false positive and unreadable in a report.
const TEXT_EXTENSIONS = new Set([
  '.md', '.mdx', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.html', '.json', '.txt', '.yml', '.yaml',
]);

/**
 * Find links to this project's own repository in a set of files.
 *
 * Pure: takes the file contents, so it is testable without a filesystem.
 * @param {Array<{path: string, text: string}>} files
 * @returns {Array<{path: string, line: number, url: string}>} one entry per occurrence
 */
export function findRepoLinks(files) {
  const findings = [];
  for (const { path, text } of files) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const matches = lines[i].match(REPO_URL_PATTERN);
      if (!matches) continue;
      for (const url of matches) findings.push({ path, line: i + 1, url });
    }
  }
  return findings;
}

/**
 * True when the path looks like a text file this check can read.
 * @param {string} path
 * @returns {boolean}
 */
export function isTextFile(path) {
  return TEXT_EXTENSIONS.has(extname(path).toLowerCase());
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (isTextFile(full)) out.push(full);
  }
  return out;
}

// Run as a command, not as an import.
if (process.argv[1] && process.argv[1].endsWith('check-no-repo-links.mjs')) {
  const paths = [];
  for (const f of SCAN_FILES) if (existsSync(f)) paths.push(f);
  for (const d of SCAN_DIRS) if (existsSync(d)) walk(d, paths);

  const files = paths.map(path => ({ path: relative('.', path), text: readFileSync(path, 'utf8') }));
  const findings = findRepoLinks(files);

  for (const f of findings) {
    console.error(`${f.path}:${f.line}: links to the source repository — ${f.url}`);
  }

  if (findings.length > 0) {
    console.error('');
    console.error(`FAIL: ${findings.length} link${findings.length === 1 ? '' : 's'} to the source repository in files that ship.`);
    console.error('The published package must not point anyone at the repository. Remove the URL and keep the');
    console.error('plain text (a version number, or a bare commit hash) if it is useful on its own.');
    process.exit(1);
  }

  console.log(`OK: no repository links in ${files.length} scanned files`);
}
