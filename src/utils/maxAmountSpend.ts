/**
 * @fileoverview Tien 02/12/2022
 */
import { CurrencyAmount, ETHER, JSBI } from '@solarswap/sdk'
import { MIN_ASA } from '../config/constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @link https://github.com/Uniswap/interface/blob/02d80e07dc42cf746452456d92d68a1b7b953a1e/src/utils/maxAmountSpend.ts#L12
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
	if (!currencyAmount) return undefined
	if (currencyAmount.currency === ETHER) {
		if (JSBI.greaterThan(currencyAmount.raw, MIN_ASA)) {
			return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ASA))
		}
		return CurrencyAmount.ether(JSBI.BigInt(0))
	}
	return currencyAmount
}
