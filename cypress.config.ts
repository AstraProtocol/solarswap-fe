import { defineConfig } from 'cypress'
import { ChainId } from '@solarswap/sdk'
require('dotenv').config()

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

export default defineConfig({
	fixturesFolder: false,
	video: false,
	defaultCommandTimeout: 20000,
	chromeWebSecurity: false,
	pageLoadTimeout: 20000,
	projectId: 'qjg2v4',
	blockHosts: ['vitals.vercel-insights.com', '*sentry.io', '*googletagmanager.com'],

	env: {
		...process.env,
		WASA:
			CHAIN_ID === ChainId.MAINNET.toString()
				? '0x6637D8275DC58983Cb3A2fa64b705EC11f6EC670'
				: '0xA625BF1c3565775B1859B579DF980Fef324E7315',
		USDT:
			CHAIN_ID === ChainId.MAINNET.toString()
				? '0x5fC4435AcA131f1F541D2fc67DC3A6a20d10a99d'
				: '0x2039A56173fDac411975Bce6F756059Ac33d0d79',
		TNT:
			CHAIN_ID === ChainId.MAINNET.toString()
				? '0x65136E09653713dCFDda550aD29E9b20E4a457C7'
				: '0xEC846C99BB9Cb375DeC6c6E07DA0F35258F22548',
		TNT2:
			CHAIN_ID === ChainId.MAINNET.toString()
				? '0x5e7311ce6E87D023751F073005555193b4Ef83F7'
				: '0xe65585B6Aa50f27d8C8aFac544c01d8668850f21',
		BUSD:
			CHAIN_ID === ChainId.MAINNET.toString()
				? '0xAc948B5E841Ba4207a681331d646577240c7fcA8'
				: '0x092d93f258ceea20c94ba01e8771115141dd7c20',
	},

	retries: {
		runMode: 2,
	},

	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
})
