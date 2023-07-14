import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

export const transaction = (operation: string, name: string) => {
  Sentry.startTransaction({
    op: operation,
    name: name,
  });
};
