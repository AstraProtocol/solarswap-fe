import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'
import { CHAIN_ID } from './networks'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
	/**
	 * These 2 farms (PID 0, 1) should always be at the top of the file.
	 */
	{
		pid: 0,
		lpSymbol: 'WASA',
		lpAddresses: {
			11115: '0xC60F8AF409Eac14d4926e641170382f313749Fdc',
			56: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
		},
		token: serializedTokens.syrup,
		quoteToken: serializedTokens.wasa
	},
	{
		pid: 1,
		lpSymbol: 'USDT-ASA LP',
		lpAddresses: {
			11115: '0xfcb81CBBB8d74030A9C5BF24e0f61d6C4a734f2f',
			56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'
		},
		token: serializedTokens.usdt,
		quoteToken: serializedTokens.wasa
	}
].filter(f => !!f.lpAddresses[CHAIN_ID])

export default farms
