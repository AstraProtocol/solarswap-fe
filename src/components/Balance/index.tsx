import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import styles from './styles.module.scss'

interface BalanceProps {
	value: number
	decimals?: number
	unit?: string
	isDisabled?: boolean
	prefix?: string
	onClick?: (event: React.MouseEvent<HTMLElement>) => void
	className?: string
}

const Balance: React.FC<BalanceProps> = ({
	value,
	decimals = 3,
	isDisabled = false,
	unit,
	prefix = '',
	onClick,
	className,
	...props
}) => {
	const previousValue = useRef(0)

	useEffect(() => {
		previousValue.current = value
	}, [value])

	return (
		<span className={clsx('money', className)} onClick={onClick} {...props}>
			<CountUp
				start={previousValue.current}
				end={value}
				prefix={prefix}
				suffix={unit}
				decimals={decimals}
				duration={1}
				separator=","
			/>
		</span>
	)
}

export default Balance

export const AnimatedBalance = ({ props }) => <Balance {...props} className={styles.animatedBalance} />
