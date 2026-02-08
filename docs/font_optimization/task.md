# Task: Font Change and Optimization

## Objective
Change the site's font to "Noto Sans JP" and optimize its loading process.

## Background
- Current font: `LINE Seed JP` -> Replaced with `Noto Sans JP Variable`.
- Goal: Switch to `Noto Sans JP` using modern best practices and verify performance.
- Optimization: `font-display: swap` is active. Investigated `preload` necessity.

## Requirements
1.  [x] Replace `@fontsource/line-seed-jp` with `@fontsource-variable/noto-sans-jp`.
2.  [x] Update `baseHead.astro` to import the new font.
3.  [x] Update `global.css` to use the new font family.
4.  [x] Verify that `font-display: swap` is active.
5.  [x] Clean up old dependencies.
6.  [x] **Evaluate `preload` necessity**: current dynamic subsetting approach via `unicode-range` is superior to static preloading for Japanese fonts.

## Constraints
- Keep existing styling structure.
- Ensure Japanese text renders correctly.
