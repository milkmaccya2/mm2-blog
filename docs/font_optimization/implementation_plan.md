# Implementation Plan - Font Change to Noto Sans JP

## 1. Dependency Management
- [x] Uninstall `@fontsource/line-seed-jp`.
- [x] Install `@fontsource-variable/noto-sans-jp`.

## 2. Component Updates
- [x] Edit `src/components/BaseHead.astro`:
    - Changed import to `@fontsource-variable/noto-sans-jp`.

## 3. Style Updates
- [x] Edit `src/styles/global.css`:
    - Updated `--font-body` to `'Noto Sans JP Variable', sans-serif`.

## 4. Optimization & Verification
- [x] Verify `font-display: swap` (default in package).
- [x] **Preload Strategy**:
    - Decision: Do NOT implement explicit `<link rel="preload">` for font files.
    - Reason: Japanese variable fonts are split into many subsets via `unicode-range`. Preloading all of them causes massive bandwidth usage. Preloading only "some" is difficult to maintain and predict. The browser's native lazy-loading based on `unicode-range` is the most performant strategy.

## 5. Final Checks
- [x] Build and preview.
- [x] Check Japanese rendering.
