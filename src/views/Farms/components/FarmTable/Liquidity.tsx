import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import Skeleton from 'react-loading-skeleton'
import { Icon, IconEnum } from '@astraprotocol/astra-ui'
import styles from './styles.module.scss'

export interface LiquidityProps {
	liquidity: BigNumber
}

const Liquidity: React.FunctionComponent<LiquidityProps> = ({ liquidity }) => {
	const displayLiquidity =
		liquidity && liquidity.gt(0) ? (
			`$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
		) : (
			<Skeleton width={60} />
		)
	const { t } = useTranslation()
	// const { targetRef, tooltip, tooltipVisible } = useTooltip(
	//   t('Total value of the funds in this farm’s liquidity pool'),
	//   { placement: 'top-end', tooltipOffset: [20, 10] },
	// )

	return (
		<div className="flex flex-align-center">
			<div className={styles.liquidityWrapper}>
				<span className="money money-sm">{displayLiquidity}</span>
			</div>
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

export default Liquidity
