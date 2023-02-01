import clsx from 'clsx'
import useLastTruthy from 'hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'
import styles from './styles.module.scss'

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
	const lastTrade = useLastTruthy(trade)

	return (
		<div className={clsx(styles.advancedDetailsFooter, Boolean(trade) && styles.advancedDetailsFooterShow)}>
			<AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
		</div>
	)
}
