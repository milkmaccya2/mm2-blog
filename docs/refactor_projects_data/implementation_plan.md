# Implementation Plan - Refactor Project Data

## Goal
Centralize project information into a single source of truth and update both the Homepage and Projects page to consume this data.

## Proposed Changes

### 1. Create Data File (`src/data/projects.ts`)
- Define a `Project` interface.
- Create and export a `PROJECTS` constant containing the array of project objects previously hardcoded in `src/pages/projects.astro` and `src/pages/index.astro`.

### 2. Update Projects Page (`src/pages/projects.astro`)
- Import `PROJECTS` from `../data/projects`.
- Replace the hardcoded `ProjectCard` components with a `.map()` iteration over the `PROJECTS` array.

### 3. Update Homepage (`src/pages/index.astro`)
- Import `PROJECTS` from `../data/projects`.
- attributes `const projects = PROJECTS.slice(0, 2);` to get the top 2 projects.
- Ensure the rendering logic uses this `projects` variable (which it already should, based on previous implementation).

## Verification Plan
- **Data Check**: Ensure all project details (title, description, tags, URLs) are correctly migrated to `src/data/projects.ts`.
- **Homepage Check**: Verify that the homepage displays exactly 2 projects and that they match the first two in the data file.
- **Projects Page Check**: Verify that the projects page displays all projects in the correct order.
- **Build Check**: Ensure `npm run build` succeeds.
