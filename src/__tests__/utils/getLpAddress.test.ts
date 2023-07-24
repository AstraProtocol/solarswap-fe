import { Token, ChainId } from '@solarswap/sdk'
import getLpAddress from 'utils/getLpAddress'
import { CHAIN_ID } from 'config/constants/networks'

const chainId = CHAIN_ID === ChainId.MAINNET.toString() ? ChainId.MAINNET : ChainId.TESTNET
const WASA_AS_STRING = chainId === ChainId.MAINNET ? '0xEAd8b0094072CAAa333DD2Ca72E5856f808e83Cf' : '0xA625BF1c3565775B1859B579DF980Fef324E7315'
const USDT_AS_STRING = chainId === ChainId.MAINNET ? '0xa0161089652A33eeA83168dCd74287E58b390910' : '0x2039A56173fDac411975Bce6F756059Ac33d0d79'
const WASA_AS_TOKEN = new Token(chainId, WASA_AS_STRING, 18)
const USDT_AS_TOKEN = new Token(chainId, USDT_AS_STRING, 18)
const WASA_USDT_LP = chainId === ChainId.MAINNET ? '0x654272F07Aa573ca5775F7aaDB28388754619Ba9' : '0xEcd38FcDA1e283d6344BF6A5970979C68dA5064F'

describe('getLpAddress', () => {
	it('returns correct LP address, both tokens are strings', () => {
		expect(getLpAddress(WASA_AS_STRING, USDT_AS_STRING)).toBe(WASA_USDT_LP)
	})
	it('returns correct LP address, token1 is string, token 2 is Token', () => {
		expect(getLpAddress(WASA_AS_STRING, USDT_AS_TOKEN)).toBe(WASA_USDT_LP)
	})
	it('returns correct LP address, both tokens are Token', () => {
		expect(getLpAddress(WASA_AS_TOKEN, USDT_AS_TOKEN)).toBe(WASA_USDT_LP)
	})
	it('returns null if any address is invalid', () => {
		expect(getLpAddress('123', '456')).toBe(null)
		expect(getLpAddress(undefined, undefined)).toBe(null)
		expect(getLpAddress(WASA_AS_STRING, undefined)).toBe(null)
		expect(getLpAddress(undefined, USDT_AS_TOKEN)).toBe(null)
		expect(getLpAddress(WASA_AS_STRING, '456')).toBe(null)
		expect(getLpAddress('123', USDT_AS_TOKEN)).toBe(null)
	})
})
