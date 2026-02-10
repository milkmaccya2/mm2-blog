# Implementation Plan: Sentry Setup

## 1. Install Sentry
- use `npx astro add @sentry/astro` to automatically install dependencies and generate configuration files.
- This command usually creates `sentry.client.config.js`, `sentry.server.config.js` and updates `astro.config.mjs`.

## 2. Configure Sentry
- **Client-side (`sentry.client.config.js`)**:
    - Initialize Sentry with the DSN (use placeholder or env var).
    - Set `sampleRate: 1.0`.
    - Set `replaysSessionSampleRate: 0`.
    - Set `replaysOnErrorSampleRate: 1.0`.
    - Ensure `Sentry.replayIntegration()` is included in configurations if recommended by the setup, but typical `replaysOnErrorSampleRate` option implies replay integration is available.
- **Server-side (`sentry.server.config.js`)**:
    - Initialize Sentry.
    - Set `sampleRate: 1.0` (Server-side replays are not applicable in the same way, but tracing might be. We will focus on error reporting).

## 3. Verify Configurations
- Check `astro.config.mjs` to ensure `@sentry/astro` integration is present.
- Ensure `sourceMapsUploadOptions` are handled (or disabled if no auth token is provided yet).

## 4. Environment Variables
- Determine how to handle `SENTRY_DSN`. Usually handled via `.env` or build environment.

## 5. Review
- Check if the code compiles and runs.
