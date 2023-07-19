import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'
import { CHAIN_ID } from './networks'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
	/**
	 * These 2 farms (PID 0, 1) should always be at the top of the file.
	 */
	// {
	// 	pid: 0,
	// 	lpSymbol: 'WASA',
	// 	lpAddresses: {
	// 		11115: '0xA625BF1c3565775B1859B579DF980Fef324E7315',
	// 		11110: '0xEAd8b0094072CAAa333DD2Ca72E5856f808e83Cf',
	// 	},
	// 	token: serializedTokens.wasa,
	// 	quoteToken: serializedTokens.wasa,
	// },
	{
		pid: 1,
		lpSymbol: 'USDT-ASA LP',
		lpAddresses: {
			11115: '0xecd38fcda1e283d6344bf6a5970979c68da5064f',
			11110: '0x654272f07aa573ca5775f7aadb28388754619ba9',
		},
		token: serializedTokens.usdt,
		quoteToken: serializedTokens.wasa,
	},
].filter(f => !!f.lpAddresses[CHAIN_ID])

export default farms
