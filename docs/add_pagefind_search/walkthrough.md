# Walkthrough - Add Pagefind Search (Modal)

## Changes

### `package.json`
- Added `pagefind` to `devDependencies`.
- Updated `build` script to include `pagefind`.

### `src/components/Search.astro`
- **New Component**: Encapsulates all search-related UI and logic.
- **Button**: A magnifying glass icon to trigger the search.
- **Modal**: A `<dialog>` element containing the search interface.
- **Script**: Integrates Pagefind UI and handles modal open/close logic.
- **Styles**: Custom styling for the modal and Pagefind UI variables.

### `src/components/Header.astro`
- **Updated**: Now imports and uses the `<Search />` component.
- **Cleaned Up**: Removed inline search styles and scripts.

### `src/pages/search.astro`
- **Removed**: No longer needed.

## Verification Results
- [ ] Build succeeds.
- [ ] Pagefind index is created.
- [ ] Search icon appears in the header (via `Search` component).
- [ ] Clicking the icon opens the modal.
- [ ] Search works within the modal.
