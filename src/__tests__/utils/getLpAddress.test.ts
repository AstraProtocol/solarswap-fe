import { Token, ChainId } from '@solarswap/sdk'
import getLpAddress from 'utils/getLpAddress'

const WASA_AS_STRING = '0xC60F8AF409Eac14d4926e641170382f313749Fdc'
const USDT_AS_STRING = '0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2'
const WASA_AS_TOKEN = new Token(ChainId.TESTNET, WASA_AS_STRING, 18)
const USDT_AS_TOKEN = new Token(ChainId.TESTNET, USDT_AS_STRING, 18)
const WASA_USDT_LP = '0xfcb81CBBB8d74030A9C5BF24e0f61d6C4a734f2f'

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
