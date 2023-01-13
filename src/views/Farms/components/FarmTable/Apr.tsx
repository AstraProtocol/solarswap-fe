import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import styles from './styles.module.scss'
import Skeleton from 'react-loading-skeleton'
import clsx from 'clsx'

export interface AprProps {
	value: string
	multiplier: string
	pid: number
	lpLabel: string
	lpSymbol: string
	tokenAddress?: string
	quoteTokenAddress?: string
	astraPrice: BigNumber
	originalValue: number
	hideButton?: boolean
}

const Apr: React.FC<AprProps> = ({
	value,
	pid,
	lpLabel,
	lpSymbol,
	multiplier,
	tokenAddress,
	quoteTokenAddress,
	astraPrice,
	originalValue,
	hideButton = false
}) => {
	const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAddress, tokenAddress })
	const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

	return originalValue !== 0 ? (
		<div className={styles.aprContainer}>
			{originalValue ? (
				<ApyButton
					variant={hideButton ? 'text' : 'text-and-button'}
					pid={pid}
					lpSymbol={lpSymbol}
					lpLabel={lpLabel}
					multiplier={multiplier}
					astraPrice={astraPrice}
					apr={originalValue}
					displayApr={value}
					addLiquidityUrl={addLiquidityUrl}
				/>
			) : (
				<div className={clsx('money money-sm', styles.aprWrapper)}>
					<Skeleton width={60} />
				</div>
			)}
		</div>
	) : (
		<div className={styles.aprContainer}>
			<div className={clsx('money money-sm', styles.aprWrapper)}>{originalValue}%</div>
		</div>
	)
}

export default Apr
