import { FC } from 'react'
import { formatAmount, formatAmountNotation, tokenPrecisionStyle } from 'utils/formatInfoNumbers'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const formatOptions = {
	notation: 'standard' as formatAmountNotation,
	displayThreshold: 0.001,
	tokenPrecision: 'normal' as tokenPrecisionStyle, // tokenPrecisionStyle
}

interface TokenDisplayProps {
	value?: number | string
	inputSymbol?: string
	outputSymbol?: string
	format?: boolean
	children: JSX.Element
}

const PairPriceDisplay: FC<TokenDisplayProps> = ({
	value,
	inputSymbol,
	outputSymbol,
	children,
	format = true,
	...props
}) => {
	return value ? (
		<div className="row flex-align-end" {...props}>
			<div className="">
				<span className="money money-2xl text-bold">
					{format
						? formatAmount(typeof value === 'string' ? parseFloat(value) : value, formatOptions)
						: value}
				</span>
				{inputSymbol && outputSymbol && (
					<span className="text text-lg text-bold margin-left-xs contrast-color-70">{`${inputSymbol}/${outputSymbol}`}</span>
				)}
				<span className="margin-left-xs">{children}</span>
			</div>
		</div>
	) : (
		<Skeleton height={36} width={128} baseColor="#312e39" />
	)
}

export default PairPriceDisplay
