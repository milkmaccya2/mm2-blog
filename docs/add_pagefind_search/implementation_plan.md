# Implementation Plan - Refactor Search Component

## Problem
The `Header.astro` component contains all the logic, styles, and markup for the search feature, making it bloated and mixing concerns.

## Proposed Solution
Extract the search button, dialog, scripts, and styles into a dedicated `src/components/Search.astro` component.

## Steps

1.  **Create `src/components/Search.astro`**
    -   Move the `<button id="search-button">`, `<dialog id="search-dialog">`, `<script>`, and `<style>` blocks from `Header.astro` to this new file.

2.  **Update `src/components/Header.astro`**
    -   Import `Search` from `./Search.astro`.
    -   Replace the removed code with `<Search />`.

## User Review Required
-   Verify that the search button still appears and works as expected.
