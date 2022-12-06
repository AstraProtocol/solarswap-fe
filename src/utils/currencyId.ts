/**
 * @fileoverview Tien 02/12/2022
 */
import { Currency, ETHER, Token } from '@solarswap/sdk'

export function currencyId(currency: Currency): string {
	if (currency === ETHER) return 'ASA'
	if (currency instanceof Token) return currency.address
	throw new Error('invalid currency')
}

export default currencyId
