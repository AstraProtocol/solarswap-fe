import clsx from 'clsx'
import Skeleton from 'react-loading-skeleton'
import styles from './styles.module.scss'
export interface EarnedProps {
	earnings: number
	pid: number
}

interface EarnedPropsWithLoading extends EarnedProps {
	userDataReady: boolean
}

const Earned: React.FunctionComponent<EarnedPropsWithLoading> = ({ earnings, userDataReady }) => {
	if (userDataReady) {
		return (
			<span className={clsx('money money-sm', styles.amount, { ['contrast-color-70']: earnings == 0 })}>
				{earnings.toLocaleString()}
			</span>
		)
	}
	return (
		<span className={clsx('money money-sm', styles.amount, { ['contrast-color-70']: earnings == 0 })}>
			<Skeleton width={60} />
		</span>
	)
}

export default Earned
