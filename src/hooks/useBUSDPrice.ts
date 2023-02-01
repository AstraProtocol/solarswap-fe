import { Currency, currencyEquals, JSBI, Price } from '@solarswap/sdk'
import tokens from 'config/constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { multiplyPriceByAmount } from 'utils/prices'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { PairState, usePairs } from './usePairs'

const { wasa: WBNB, usdt } = tokens

/**
 * Returns the price in USDT of the input currency
 * @param currency currency to compute the USDT price of
 */
export default function useBUSDPrice(currency?: Currency): Price | undefined {
	const { chainId } = useActiveWeb3React()
	const wrapped = wrappedCurrency(currency, chainId)
	const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
		() => [
			[chainId && wrapped && currencyEquals(WBNB, wrapped) ? undefined : currency, chainId ? WBNB : undefined],
			[wrapped?.equals(usdt) ? undefined : wrapped, usdt],
			[chainId ? WBNB : undefined, usdt],
		],
		[chainId, currency, wrapped],
	)
	const [[ethPairState, ethPair], [busdPairState, busdPair], [busdEthPairState, busdEthPair]] = usePairs(tokenPairs)

	return useMemo(() => {
		if (!currency || !wrapped || !chainId) {
			return undefined
		}
		// handle weth/eth
		if (wrapped.equals(WBNB)) {
			if (busdPair) {
				const price = busdPair.priceOf(WBNB)
				return new Price(currency, usdt, price.denominator, price.numerator)
			}
			return undefined
		}
		// handle usdt
		if (wrapped.equals(usdt)) {
			return new Price(usdt, usdt, '1', '1')
		}

		const ethPairETHAmount = ethPair?.reserveOf(WBNB)
		const ethPairETHBUSDValue: JSBI =
			ethPairETHAmount && busdEthPair ? busdEthPair.priceOf(WBNB).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

		// all other tokens
		// first try the usdt pair
		if (
			busdPairState === PairState.EXISTS &&
			busdPair &&
			busdPair.reserveOf(usdt).greaterThan(ethPairETHBUSDValue)
		) {
			const price = busdPair.priceOf(wrapped)
			return new Price(currency, usdt, price.denominator, price.numerator)
		}
		if (ethPairState === PairState.EXISTS && ethPair && busdEthPairState === PairState.EXISTS && busdEthPair) {
			if (busdEthPair.reserveOf(usdt).greaterThan('0') && ethPair.reserveOf(WBNB).greaterThan('0')) {
				const ethBusdPrice = busdEthPair.priceOf(usdt)
				const currencyEthPrice = ethPair.priceOf(WBNB)
				const busdPrice = ethBusdPrice.multiply(currencyEthPrice).invert()
				return new Price(currency, usdt, busdPrice.denominator, busdPrice.numerator)
			}
		}

		return undefined
	}, [chainId, currency, ethPair, ethPairState, busdEthPair, busdEthPairState, busdPair, busdPairState, wrapped])
}

export const useAstraBusdPrice = (): Price | undefined => {
	const asaBusdPrice = useBUSDPrice(tokens.wasa)
	return asaBusdPrice
}

export const useBUSDCurrencyAmount = (currency: Currency, amount: number): number | undefined => {
	const { chainId } = useActiveWeb3React()
	const busdPrice = useBUSDPrice(currency)
	const wrapped = wrappedCurrency(currency, chainId)
	if (busdPrice) {
		return multiplyPriceByAmount(busdPrice, amount, wrapped.decimals)
	}
	return undefined
}

export const useBUSDCakeAmount = (amount: number): number | undefined => {
	const asaBusdPrice = useAstraBusdPrice()
	if (asaBusdPrice) {
		return multiplyPriceByAmount(asaBusdPrice, amount)
	}
	return undefined
}

export const useBNBBusdPrice = (): Price | undefined => {
	const bnbBusdPrice = useBUSDPrice(tokens.wbnb)
	return bnbBusdPrice
}
