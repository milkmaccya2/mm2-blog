# Implement RSS Icon in Header and Footer

## Goal
Add an RSS icon to the site header and footer, alongside existing social media icons (X, GitHub), to improve discoverability of the blog feed.

## User Review Required
> [!NOTE]
> This changes the original request from "add to blog page" to "add to global header/footer". This is a better practice for RSS feeds.

## Proposed Changes
### Components
#### [MODIFY] [src/components/Header.astro](file:///Users/yokoyama/git/mm2-blog/src/components/Header.astro)
- Add RSS SVG icon to the `social-links` div.
- Link to `/rss.xml`.
- Ensure styling matches existing X and GitHub icons.

#### [MODIFY] [src/components/Footer.astro](file:///Users/yokoyama/git/mm2-blog/src/components/Footer.astro)
- Add RSS SVG icon to the `flex` container with social links.
- Link to `/rss.xml`.
- Ensure styling matches existing icons.

## Verification Plan
### Manual Verification
1. Run `npm run dev`.
2. check the Header on valid pages (Home, Blog, etc.) and verify the RSS icon is present and aligned.
3. Check the Footer on valid pages and verify the RSS icon is present.
4. Click the icon to ensure it opens `/rss.xml`.
