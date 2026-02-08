# Implementation Plan - Homepage Projects Section

## Goal
Add a "Projects" section to the homepage (`src/pages/index.astro`) that highlights key projects and links to the full Projects page.

## Proposed Changes

### 1. Update Animation Script (`src/scripts/animations.ts`)
- Add support for animating `.project-item` elements, similar to `.post-item`.
- Ensure animations trigger correctly when the Projects section comes into view.
- Update reduced motion fallback to include `.project-item`.

### 2. Update Homepage (`src/pages/index.astro`)
- Import `ProjectCard` component.
- Define a `projects` array in the frontmatter with data for featured projects (e.g., `mm2-blog`, `POS-80`).
- Insert a new `<section>` for Projects between the Hero and Recent Posts sections.
- The section will include:
    - A header with title "Projects" and a "View All" link pointing to `/projects`.
    - A brief introductory paragraph.
    - A grid displaying the featured projects using `ProjectCard` wrapped in styled containers.

## Verification Plan
- **Visual Check**: Ensure the new section appears correctly on the homepage with proper spacing and styling.
- **Animation Check**: Verify that project cards fade in and slide up as the user scrolls, consistent with other elements.
- **Link Check**: Confirm that the "View All" link works and that project cards link to their respective URLs.
- **Build Check**: Ensure `npm run build` succeeds without errors.
