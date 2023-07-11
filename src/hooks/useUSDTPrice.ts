import { Currency, currencyEquals, JSBI, Price } from '@solarswap/sdk'
import tokens from 'config/constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { multiplyPriceByAmount } from 'utils/prices'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { PairState, usePairs } from './usePairs'

const { wasa: WASA, usdt } = tokens

/**
 * Returns the price in USDT of the input currency
 * @param currency currency to compute the USDT price of
 */
export default function useUSDTPrice(currency?: Currency): Price | undefined {
	const { chainId } = useActiveWeb3React()
	const wrapped = wrappedCurrency(currency, chainId)
	const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
		() => [
			[chainId && wrapped && currencyEquals(WASA, wrapped) ? undefined : currency, chainId ? WASA : undefined],
			[wrapped?.equals(usdt) ? undefined : wrapped, usdt],
			[chainId ? WASA : undefined, usdt],
		],
		[chainId, currency, wrapped],
	)
	const [[ethPairState, ethPair], [usdtPairState, usdtPair], [usdtEthPairState, usdtEthPair]] = usePairs(tokenPairs)

	return useMemo(() => {
		if (!currency || !wrapped || !chainId) {
			return undefined
		}
		// handle weth/eth
		if (wrapped.equals(WASA)) {
			if (usdtPair) {
				const price = usdtPair.priceOf(WASA)
				return new Price(currency, usdt, price.denominator, price.numerator)
			}
			return undefined
		}
		// handle usdt
		if (wrapped.equals(usdt)) {
			return new Price(usdt, usdt, '1', '1')
		}

		const ethPairETHAmount = ethPair?.reserveOf(WASA)
		const ethPairETHBUSDValue: JSBI =
			ethPairETHAmount && usdtEthPair ? usdtEthPair.priceOf(WASA).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

		// all other tokens
		// first try the usdt pair
		if (
			usdtPairState === PairState.EXISTS &&
			usdtPair &&
			usdtPair.reserveOf(usdt).greaterThan(ethPairETHBUSDValue)
		) {
			const price = usdtPair.priceOf(wrapped)
			return new Price(currency, usdt, price.denominator, price.numerator)
		}
		if (ethPairState === PairState.EXISTS && ethPair && usdtEthPairState === PairState.EXISTS && usdtEthPair) {
			if (usdtEthPair.reserveOf(usdt).greaterThan('0') && ethPair.reserveOf(WASA).greaterThan('0')) {
				const ethUsdtPrice = usdtEthPair.priceOf(usdt)
				const currencyEthPrice = ethPair.priceOf(WASA)
				const usdtPrice = ethUsdtPrice.multiply(currencyEthPrice).invert()
				return new Price(currency, usdt, usdtPrice.denominator, usdtPrice.numerator)
			}
		}

		return undefined
	}, [chainId, currency, ethPair, ethPairState, usdtEthPair, usdtEthPairState, usdtPair, usdtPairState, wrapped])
}

export const useAstraUsdtPrice = (): Price | undefined => {
	const asaUsdtPrice = useUSDTPrice(tokens.wasa)
	return asaUsdtPrice
}

export const useBUSDCurrencyAmount = (currency: Currency, amount: number): number | undefined => {
	const { chainId } = useActiveWeb3React()
	const busdPrice = useUSDTPrice(currency)
	const wrapped = wrappedCurrency(currency, chainId)
	if (busdPrice) {
		return multiplyPriceByAmount(busdPrice, amount, wrapped.decimals)
	}
	return undefined
}


