{
  description = "Dubai Design System development environment";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";

  outputs =
    { nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-darwin"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (
        pkgs:
        let
          inherit (pkgs) lib;
          # Linux only: the generic Linux browsers Puppeteer and Playwright
          # download cannot run on NixOS, so both use these from nixpkgs.
          # macOS keeps their own downloads.
          browsers = pkgs.playwright-driver.passthru.components;
        in
        {
          default = pkgs.mkShell (
            {
              # CI pins 22.14.0 (.github/workflows/ci.yml); nixpkgs carries
              # the latest 22.x, which is close enough for development.
              packages = [ pkgs.nodejs_22 ];

              shellHook = ''
                # Keep libraries from outside the shell out of it. A parent
                # process can inject them (the Claude Code launcher once put
                # alsa-lib here), and the browsers then failed on a glibc
                # mismatch.
                unset LD_LIBRARY_PATH

                # Install on entry when node_modules is missing or older than
                # the lockfile: a fresh clone, or a pull that changed it.
                root=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
                if [ -f "$root/package-lock.json" ] \
                  && [ ! "$root/node_modules/.package-lock.json" -nt "$root/package-lock.json" ]; then
                  echo "dubai-design-system: installing dependencies (npm ci)" >&2
                  (cd "$root" && npm ci --no-audit --no-fund >&2) || echo "npm ci failed; run it by hand" >&2
                fi
              ''
              + lib.optionalString pkgs.stdenv.isLinux ''

                # Playwright (Storybook's a11y sweep, `npm run test:a11y:ci`)
                # looks for browsers under revision-numbered directories. Link
                # nixpkgs' builds under the revisions the installed Playwright
                # asks for, read from its browsers.json, so a Playwright bump
                # needs no change here.
                pwjson="$root/node_modules/playwright-core/browsers.json"
                if [ -f "$pwjson" ]; then
                  export PLAYWRIGHT_BROWSERS_PATH="$root/.direnv/playwright-browsers"
                  rm -rf "$PLAYWRIGHT_BROWSERS_PATH"
                  mkdir -p "$PLAYWRIGHT_BROWSERS_PATH"
                  rev() { node -p "require('$pwjson').browsers.find(b => b.name === '$1').revision"; }
                  ln -s ${browsers.chromium} "$PLAYWRIGHT_BROWSERS_PATH/chromium-$(rev chromium)"
                  ln -s ${browsers.chromium-headless-shell} "$PLAYWRIGHT_BROWSERS_PATH/chromium_headless_shell-$(rev chromium-headless-shell)"
                  ln -s ${browsers.ffmpeg} "$PLAYWRIGHT_BROWSERS_PATH/ffmpeg-$(rev ffmpeg)"
                fi

                # The design system's own Dubai font, so pages rendered without
                # its stylesheets (e2e `setContent`) still get it rather than a
                # fallback. It ships in the repo, so add it here on entry.
                dubai="$root/packages/dom/ar/assets/fonts/dubai"
                if [ -d "$dubai" ]; then
                  mkdir -p "$root/.direnv"
                  printf '<?xml version="1.0"?>\n<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">\n<fontconfig>\n  <include>%s</include>\n  <dir>%s</dir>\n</fontconfig>\n' \
                    "$FONTCONFIG_FILE" "$dubai" > "$root/.direnv/fonts.conf"
                  export FONTCONFIG_FILE="$root/.direnv/fonts.conf"
                fi
              '';
            }
            // lib.optionalAttrs pkgs.stdenv.isLinux {
              # Stencil's e2e tests (Puppeteer) run in chrome-headless-shell,
              # not full Chromium: it is the old headless mode that CI's
              # Puppeteer-downloaded Chrome 121 runs. In current Chromium
              # `--headless` means the new mode, where only one page has focus,
              # and ~15 keyboard-focus tests failed whenever suites ran in
              # parallel against the shared browser.
              #
              # CONTRIBUTING's `export PUPPETEER_EXECUTABLE_PATH=$(node -e …)`
              # still works: puppeteer.executablePath() returns this variable.
              PUPPETEER_SKIP_DOWNLOAD = "1";
              PUPPETEER_EXECUTABLE_PATH = "${browsers.chromium-headless-shell}/chrome-headless-shell-linux64/chrome-headless-shell";

              PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
              # Its host check looks for Ubuntu packages; the nixpkgs builds
              # carry their own libraries.
              PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";

              # Fonts for the browsers. A headless host may configure none
              # (kakapo doesn't), and Chromium then aborted when a page listed
              # the installed fonts, taking down the browser every e2e suite
              # shares. These are the families GitHub's Ubuntu runners have,
              # with fontconfig's own rules (Arial -> Liberation Sans,
              # sans-serif -> DejaVu Sans) rather than the host's /etc/fonts,
              # which may be absent: without them every family fell back to
              # "DejaVu Math TeX Gyre" and fallback text measured wider than in
              # CI.
              FONTCONFIG_FILE = pkgs.writeText "fonts.conf" ''
                <?xml version="1.0"?>
                <!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
                <fontconfig>
                  <include>${pkgs.fontconfig.out}/etc/fonts/conf.d</include>
                  <dir>${pkgs.dejavu_fonts}/share/fonts</dir>
                  <dir>${pkgs.liberation_ttf}/share/fonts</dir>
                  <cachedir prefix="xdg">fontconfig</cachedir>
                </fontconfig>
              '';
            }
          );
        }
      );
    };
}
