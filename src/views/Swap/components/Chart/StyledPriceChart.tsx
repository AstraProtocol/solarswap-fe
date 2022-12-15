import { ReactChildren } from 'react'
import styles from './styles.module.scss'

interface Props {
	isFullWidthContainer?: boolean
	isExpanded?: boolean
	children: JSX.Element | JSX.Element[] | string | string[]
}

const StyledPriceChart = ({ children, isFullWidthContainer, isExpanded }: Props) => (
	<div
		className={styles.priceChart}
		style={{
			width: isFullWidthContainer || isExpanded ? '100%' : '50%',
			height: isExpanded ? 'calc(100vh - 100px)' : '516px'
		}}
	>
		{children}
	</div>
)

export default StyledPriceChart
