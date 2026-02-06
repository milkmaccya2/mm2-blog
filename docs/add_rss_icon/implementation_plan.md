# Refine RSS Icon Design

## Goal
Improve the recognizability of the RSS icon in the Header and Footer by updating the SVG path. The user pointed out that the arcs might be overlapping or hard to distinguish.

## Proposed Changes
### Components
#### [MODIFY] [src/components/Header.astro](file:///Users/yokoyama/git/mm2-blog/src/components/Header.astro)
- Replace the current RSS SVG path with a cleaner, standard version (e.g., Material Design or simple geometric arcs) to ensure the arcs are clearly separated.

#### [MODIFY] [src/components/Footer.astro](file:///Users/yokoyama/git/mm2-blog/src/components/Footer.astro)
- Apply the same SVG path update as the Header.

## Verification Plan
### Manual Verification
1. Run `npm run dev`.
2. check the Header and Footer icons.
3. Confirm the "dot" and "arcs" are clearly separated and look like a standard RSS feed icon.
