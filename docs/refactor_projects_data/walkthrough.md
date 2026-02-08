# Walkthrough - Refactor Project Data

I have centralized the project information and updated the pages to use this shared data source.

## Changes

### `src/data/projects.ts`
- Created a new file to store project data.
- Defined the `Project` interface and `PROJECTS` array containing all project details.

### `src/pages/projects.astro`
- Removed hardcoded `ProjectCard` elements.
- Imported `PROJECTS` and mapped over it to render the cards dynamically.

### `src/pages/index.astro`
- Removed the local `projects` array.
- Imported `PROJECTS` and used `.slice(0, 2)` to display only the first two projects.

## Verification Results
- **Refactoring Success**: Both pages now draw from the same data source, making future updates easier.
- **Homepage**: Correctly shows the top 2 projects (`mm2-blog` and `POS-80`).
- **Projects Page**: correctly shows all projects.
