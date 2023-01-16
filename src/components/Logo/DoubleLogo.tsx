import { Currency } from '@solarswap/sdk'
import clsx from 'clsx'

import CurrencyLogo from './CurrencyLogo'

interface DoubleCurrencyLogoProps {
	margin?: boolean
	size?: number
	currency0?: Currency
	currency1?: Currency
}

export default function DoubleCurrencyLogo({
	currency0,
	currency1,
	size = 20,
	margin = false
}: DoubleCurrencyLogoProps) {
	return (
		<div className={clsx('flex flex-hor-center flex-col-center', margin && 'margin-right-2xs')}>
			{currency0 && <CurrencyLogo currency={currency0} size={size} style={{ marginRight: 4 }} />}
			{currency1 && <CurrencyLogo currency={currency1} size={size} />}
		</div>
	)
}
