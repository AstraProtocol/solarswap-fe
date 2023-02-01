import { defineConfig } from "cypress";

export default defineConfig({
  fixturesFolder: false,
  video: false,
  defaultCommandTimeout: 10000,
  chromeWebSecurity: false,
  pageLoadTimeout: 10000,

  blockHosts: [
    "vitals.vercel-insights.com",
    "*sentry.io",
    "*googletagmanager.com",
  ],

  retries: {
    runMode: 2,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
