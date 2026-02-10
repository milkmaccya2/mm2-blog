import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  integrations: [
    Sentry.replayIntegration({
      // Mask all text input fields by default to protect PII
      maskAllInputs: true,
      // For additional security, block specific elements containing highly sensitive data
      block: ['[data-sentry-mask]'],
    }),
  ],
  // 1. Send all errors
  sampleRate: 1.0,

  // 2. Do not record normal sessions
  replaysSessionSampleRate: 0,

  // 3. Record 100% of sessions with errors
  replaysOnErrorSampleRate: 1.0, 
});
