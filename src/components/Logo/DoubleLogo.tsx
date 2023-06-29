import { Currency } from '@solarswap/sdk'
import clsx from 'clsx'

import CurrencyLogo, { isETHER } from './CurrencyLogo'

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
	margin = false,
}: DoubleCurrencyLogoProps) {
	const isASA = isETHER(currency0)
	return (
		<div className={clsx('flex flex-hor-center flex-col-center', margin && 'margin-right-2xs')}>
			{currency0 && <CurrencyLogo currency={currency0} size={isASA ? size + 1 : size} />}
			{currency1 && <CurrencyLogo currency={currency1} size={size} />}
		</div>
	)
}
