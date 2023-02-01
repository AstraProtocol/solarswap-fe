import { FC } from 'react'
import { formatAmount, formatAmountNotation } from 'utils/formatInfoNumbers'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { Flex, FlexGap } from './Layout/Flex'

const formatOptions = {
	notation: 'standard' as formatAmountNotation,
	displayThreshold: 0.001,
	tokenPrecision: true,
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
		<FlexGap alignItems="baseline" {...props}>
			<div className="flex flex-align-inherits">
				<span className="text text-sm text-bold">
					{format
						? formatAmount(typeof value === 'string' ? parseFloat(value) : value, formatOptions)
						: value}
				</span>
				{inputSymbol && outputSymbol && (
					<span className="text text-lg text-bold">{`${inputSymbol}/${outputSymbol}`}</span>
				)}
			</div>
			{children}
		</FlexGap>
	) : (
		<Skeleton height={36} width={128} baseColor="#312e39" />
	)
}

export default PairPriceDisplay
