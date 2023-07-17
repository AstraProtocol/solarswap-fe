import BigNumber from 'bignumber.js'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'

export const BIG_ZERO = new BigNumber(0)
export const BIG_ONE = new BigNumber(1)
export const BIG_NINE = new BigNumber(9)
export const BIG_TEN = new BigNumber(10)

export const ethersToSerializedBigNumber = (ethersBn: EthersBigNumber): SerializedBigNumber =>
	ethersToBigNumber(ethersBn).toJSON()

export const ethersToBigNumber = (ethersBn: EthersBigNumber): BigNumber => new BigNumber(ethersBn.toString())

/**
 * 
 * @param args 
 * @returns [min, max] of array of big numbers
 */
export const bigIntMinAndMax = (...args: BigNumber[]) => {
	return args.reduce(
		([min, max], e) => {
			return [e.lt(min) ? e : min, e.gt(max) ? e : max]
		},
		[args[0], args[0]],
	)
}