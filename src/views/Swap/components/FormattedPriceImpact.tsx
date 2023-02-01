import { Percent } from '@solarswap/sdk'
import clsx from 'clsx'
import { warningSeverity } from 'utils/prices'
import { ONE_BIPS } from '../../../config/constants'

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
	const severity = warningSeverity(priceImpact)
	return (
		<span
			className={clsx('text text-sm', {
				['alert-color-success']: severity == 0,
				['alert-color-warning']: severity == 2,
				['alert-color-failure']: severity == 3 || severity == 4,
			})}
		>
			{priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
		</span>
	)
}
