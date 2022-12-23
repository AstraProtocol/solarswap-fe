import clsx from 'clsx'
import useLastTruthy from 'hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'
import styles from './styles.module.scss'

// const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
// 	margin-top: ${({ show }) => (show ? '16px' : 0)};
// 	padding-top: 16px;
// 	padding-bottom: 16px;
// 	width: 100%;
// 	max-width: 400px;
// 	border-radius: 20px;
// 	background-color: ${({ theme }) => theme.colors.invertedContrast};

// 	transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
// 	transition: transform 300ms ease-in-out;
// `

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
	const lastTrade = useLastTruthy(trade)

	return (
		<div className={clsx(styles.advancedDetailsFooter, Boolean(trade) && styles.advancedDetailsFooterShow)}>
			<AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
		</div>
	)
}
