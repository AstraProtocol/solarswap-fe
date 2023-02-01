import { ChainId, Token } from '@solarswap/sdk'
import { serializeToken } from 'state/user/hooks/helpers'
import { CHAIN_ID } from './networks'
import { SerializedToken } from './types'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
	[symbol: string]: Token
}

const defineTokens = <T extends TokenList>(t: T) => t

export const mainnetTokens = defineTokens({
	wasa: new Token(
		MAINNET,
		'0xC60F8AF409Eac14d4926e641170382f313749Fdc',
		18,
		'WASA',
		'Wrapped ASA',
		'https://www.astranaut.io/',
	),
	wbnb: new Token(
		MAINNET,
		'0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
		18,
		'WBNB',
		'Wrapped BNB',
		'https://www.binance.com/',
	),
	usdt: new Token(
		MAINNET,
		'0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2',
		18,
		'USDT',
		'Tether USD',
		'https://tether.to/',
	),
	syrup: new Token(
		MAINNET,
		'0x009cF7bC57584b7998236eff51b98A168DceA9B0',
		18,
		'SYRUP',
		'SyrupBar Token',
		'https://solarswap.io/',
	),
	// bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
	// bnb: new Token(MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'BNB', 'BNB', 'https://www.binance.com/')
} as const)

export const testnetTokens = defineTokens({
	wasa: new Token(
		TESTNET,
		'0xC60F8AF409Eac14d4926e641170382f313749Fdc',
		18,
		'WASA', // must exactly the same with contract
		'Wrapped ASA',
		'https://www.astranaut.io/',
	),

	usdt: new Token(
		TESTNET,
		'0x6f74f5511ba144990A8aeBaF20AFBD3B56EedCb2',
		18,
		'USDT',
		'Tether USD',
		'https://tether.to/',
	),
	syrup: new Token(
		TESTNET,
		'0x860cdE74b376940dA84680AfD24cCFE3F89d0178',
		18,
		'SYRUP',
		'SyrupBar Token',
		'https://solarswap.io/',
	),
} as const)

const tokens = () => {
	const chainId = CHAIN_ID

	// If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
	if (parseInt(chainId, 10) === ChainId.TESTNET) {
		return Object.keys(mainnetTokens).reduce((accum, key) => {
			return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
		}, {} as typeof testnetTokens & typeof mainnetTokens)
	}

	return mainnetTokens
}

const unserializedTokens = tokens()

type SerializedTokenList = Record<keyof typeof unserializedTokens, SerializedToken>

export const serializeTokens = () => {
	const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
		return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
	}, {} as SerializedTokenList)

	return serializedTokens
}

export default unserializedTokens
