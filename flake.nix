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
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell (
          {
            # CI pins 22.14.0 (.github/workflows/ci.yml); nixpkgs carries the
            # latest 22.x, which is close enough for development.
            packages = [ pkgs.nodejs_22 ];
            # Keep libraries from outside the shell out of it. The Claude Code
            # launcher sets LD_LIBRARY_PATH (for alsa-lib) and every command an
            # agent runs inherits it; the browser then loaded that newer
            # libasound and failed on a glibc mismatch.
            shellHook = ''
              unset LD_LIBRARY_PATH
            '';
          }
          // pkgs.lib.optionalAttrs pkgs.stdenv.isLinux {
            # Puppeteer (Stencil's e2e tests) downloads a generic Linux Chrome,
            # which cannot run on NixOS, so use one from nixpkgs. On macOS its
            # own download works, so nothing is set there.
            #
            # chrome-headless-shell, not full Chromium: it is the old headless
            # mode that CI's Puppeteer-downloaded Chrome 121 runs. In current
            # Chromium `--headless` means the new mode, where only one page has
            # focus, and ~15 keyboard-focus tests failed whenever suites ran in
            # parallel against the shared browser. With the shell they pass.
            #
            # CONTRIBUTING's `export PUPPETEER_EXECUTABLE_PATH=$(node -e …)`
            # still works: puppeteer.executablePath() returns this variable.
            PUPPETEER_SKIP_DOWNLOAD = "1";
            PUPPETEER_EXECUTABLE_PATH = "${pkgs.playwright-driver.passthru.components.chromium-headless-shell}/chrome-headless-shell-linux64/chrome-headless-shell";
            # Fonts for the browser. A headless host may configure none (kakapo
            # doesn't), and Chromium then aborted when a page listed the
            # installed fonts, taking down the browser every e2e suite shares.
            # These are the families GitHub's Ubuntu runners have.
            FONTCONFIG_FILE = pkgs.makeFontsConf {
              fontDirectories = [
                pkgs.dejavu_fonts
                pkgs.liberation_ttf
              ];
            };
          }
        );
      });
    };
}
