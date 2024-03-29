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
		'0x6637D8275DC58983Cb3A2fa64b705EC11f6EC670',
		18,
		'WASA',
		'Wrapped ASA',
		'https://www.astranaut.io/',
	),
	usdt: new Token(
		MAINNET,
		'0x5fC4435AcA131f1F541D2fc67DC3A6a20d10a99d',
		18,
		'USDT',
		'Tether USD',
		'https://tether.to/',
	),
} as const)

export const testnetTokens = defineTokens({
	wasa: new Token(
		TESTNET,
		'0xA625BF1c3565775B1859B579DF980Fef324E7315',
		18,
		'WASA', // must exactly the same with contract
		'Wrapped ASA',
		'https://www.astranaut.io/',
	),

	usdt: new Token(
		TESTNET,
		'0x2039A56173fDac411975Bce6F756059Ac33d0d79',
		18,
		'USDT',
		'Tether USD',
		'https://tether.to/',
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
