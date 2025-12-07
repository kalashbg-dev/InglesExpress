import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_APP_ENV || "development";
const RELEASE = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

if (SENTRY_DSN && ENVIRONMENT !== "development") {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: RELEASE,
    tracesSampleRate: ENVIRONMENT === "production" ? 0.05 : 1.0,
  });
}
