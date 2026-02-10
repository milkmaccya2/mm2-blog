import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,

  // 1. Send all errors
  sampleRate: 1.0,
});
