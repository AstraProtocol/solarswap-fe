import { Token, ChainId } from '@solarswap/sdk'
import getLpAddress from 'utils/getLpAddress'
import { CHAIN_ID } from 'config/constants/networks'

const chainId = CHAIN_ID === ChainId.MAINNET.toString() ? ChainId.MAINNET : ChainId.TESTNET
const WASA_AS_STRING = chainId === ChainId.MAINNET ? '0x6637D8275DC58983Cb3A2fa64b705EC11f6EC670' : '0xA625BF1c3565775B1859B579DF980Fef324E7315'
const USDT_AS_STRING = chainId === ChainId.MAINNET ? '0x5fC4435AcA131f1F541D2fc67DC3A6a20d10a99d' : '0x2039A56173fDac411975Bce6F756059Ac33d0d79'
const WASA_AS_TOKEN = new Token(chainId, WASA_AS_STRING, 18)
const USDT_AS_TOKEN = new Token(chainId, USDT_AS_STRING, 18)
const WASA_USDT_LP = chainId === ChainId.MAINNET ? '0x09194e6605443d56fD3Cc2f95919af68adde5e66' : '0xEcd38FcDA1e283d6344BF6A5970979C68dA5064F'

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
