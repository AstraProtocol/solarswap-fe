import clsx from 'clsx'
import styles from './styles.module.scss'

interface Props {
	isFullWidthContainer?: boolean
	isExpanded?: boolean
	isMobile?: boolean
	children: JSX.Element | JSX.Element[] | string | string[]
	style?: React.CSSProperties
}

const StyledPriceChart = ({ children, isMobile, isFullWidthContainer, isExpanded, style }: Props) => (
	<div
		className={clsx(styles.priceChart, !isMobile && 'border border-base')}
		style={{
			width: '100%',
			height: isExpanded ? 'calc(100vh - 100px)' : '516px',
			...style,
		}}
	>
		{children}
	</div>
)

export default StyledPriceChart
