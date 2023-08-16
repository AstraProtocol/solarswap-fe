import { HTMLAttributes } from 'react'

export interface PercentProps extends HTMLAttributes<HTMLSpanElement> {
	value: number | undefined
}

const Percent: React.FC<React.PropsWithChildren<PercentProps>> = ({ value, ...rest }) => {
	if (!value || Number.isNaN(value)) {
		return <span {...rest}>-</span>
	}

	const isNegative = value < 0

	return (
		<span {...rest} color={isNegative ? 'failure' : 'success'}>
			{isNegative ? '↓' : '↑'}
			{Math.abs(value).toFixed(2)}%
		</span>
	)
}

export default Percent
