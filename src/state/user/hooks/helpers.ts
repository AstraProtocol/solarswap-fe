import { Token } from '@solarswap/sdk'
import { SerializedToken } from 'config/constants/types'
import { parseUnits } from '@ethersproject/units'

export function serializeToken(token: Token): SerializedToken {
	return {
		chainId: token.chainId,
		address: token.address,
		decimals: token.decimals,
		symbol: token.symbol,
		name: token.name,
		projectLink: token.projectLink
	}
}

export function deserializeToken(serializedToken: SerializedToken): Token {
	return new Token(
		serializedToken.chainId,
		serializedToken.address,
		serializedToken.decimals,
		serializedToken.symbol,
		serializedToken.name,
		serializedToken.projectLink
	)
}

/**
 * @description GAS_PRICE
 */
export enum GAS_PRICE {
	default = '8',
	fast = '9',
	instant = '10',
	testnet = '1'
}

export const GAS_PRICE_GWEI = {
	default: parseUnits(GAS_PRICE.default, 'gwei').toString(),
	fast: parseUnits(GAS_PRICE.fast, 'gwei').toString(),
	instant: parseUnits(GAS_PRICE.instant, 'gwei').toString(),
	testnet: parseUnits(GAS_PRICE.testnet, 'gwei').toString()
}
