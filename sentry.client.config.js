import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  // 1. Send all errors
  sampleRate: 1.0,

  // 2. Do not record normal sessions
  replaysSessionSampleRate: 0,

  // 3. Record 100% of sessions with errors
  replaysOnErrorSampleRate: 1.0,
});

// Lazy-load replay integration to reduce initial bundle size.
// Since replaysSessionSampleRate is 0, replay only activates on errors,
// so deferring its load does not affect normal page monitoring.
import('@sentry/astro').then(({ replayIntegration }) => {
  Sentry.addIntegration(
    replayIntegration({
      maskAllInputs: true,
      block: ['[data-sentry-mask]'],
    })
  );
});
