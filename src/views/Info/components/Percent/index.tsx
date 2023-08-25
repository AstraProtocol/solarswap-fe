import clsx from 'clsx'
import { HTMLAttributes } from 'react'

export interface PercentProps extends HTMLAttributes<HTMLSpanElement> {
	value: number | undefined
}

const Percent: React.FC<React.PropsWithChildren<PercentProps>> = ({ value, ...rest }) => {
	if (!value || Number.isNaN(value)) {
		return null
	}

	const isNegative = value < 0

	return (
		<span className={clsx('text text-base', isNegative ? 'alert-color-error' : 'alert-color-success')} {...rest}>
			{isNegative ? '↓' : '↑'}
			{Math.abs(value).toFixed(2)}%
		</span>
	)
}

export default Percent
