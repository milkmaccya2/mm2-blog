# Walkthrough - Font Change to Noto Sans JP

## Status
Completed

## Changes
### 1. Dependencies
- Removed `@fontsource/line-seed-jp`.
- Added `@fontsource-variable/noto-sans-jp`.

### 2. `src/components/BaseHead.astro`
- Updated font import to `@fontsource-variable/noto-sans-jp`.

### 3. `src/styles/global.css`
- Updated CSS variable `--font-body` to `'Noto Sans JP Variable', sans-serif`.

## Technical Decisions
### Why no `preload`?
- **Subsetting**: The Japanese font is split into over 100 small chunks (subsets) to optimize file size.
- **Performance**: Preloading all chunks would download megabytes of unnecessary data.
- **Efficiency**: We rely on the browser's `unicode-range` mechanism in CSS. The browser downloads ONLY the chunks containing the characters actually rendered on the page. This is far more efficient than static preloading.

## Verification Results
- [x] Font loads correctly.
- [x] Network request count/size optimized (variable font + subsets confirmed in build output).
