import { defineConfig } from 'cypress'
require('dotenv').config()

export default defineConfig({
	fixturesFolder: false,
	video: false,
	defaultCommandTimeout: 20000,
	chromeWebSecurity: false,
	pageLoadTimeout: 20000,
	projectId: 'qjg2v4',
	blockHosts: ['vitals.vercel-insights.com', '*sentry.io', '*googletagmanager.com'],

	env: {...process.env},

	retries: {
		runMode: 2,
	},

	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
})
