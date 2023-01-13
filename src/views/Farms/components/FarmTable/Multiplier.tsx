import { Icon, IconEnum } from '@astraprotocol/astra-ui'
import clsx from 'clsx'
import { useTranslation } from 'contexts/Localization'
import Skeleton from 'react-loading-skeleton'
import styles from './styles.module.scss'

export interface MultiplierProps {
	multiplier: string
}

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
	const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />
	const { t } = useTranslation()
	const tooltipContent = (
		<>
			<span className="text text-base">
				{t(
					'The Multiplier represents the proportion of ASA rewards each farm receives, as a proportion of the ASA produced each block.'
				)}
			</span>
			<span className="text text-base">
				{t('For example, if a 1x farm received 1 ASA per block, a 40x farm would receive 40 ASA per block.')}
			</span>
			<span className="text text-base">
				{t('This amount is already included in all APR calculations for the farm.')}
			</span>
		</>
	)
	// const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
	// 	placement: 'top-end',
	// 	tooltipOffset: [20, 10]
	// })

	return (
		<div className="flex flex-align-center">
			<div className={clsx(styles.multiplierWrapper, 'money money-sm')}>{displayMultiplier}</div>
			<div
				style={{ display: 'inline-block' }}
				// ref={targetRef}
			>
				<Icon icon={IconEnum.ICON_HELP} />
			</div>
			{/* {tooltipVisible && tooltip} */}
		</div>
	)
}

export default Multiplier
