import { useTranslation } from 'contexts/Localization'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getAddress } from 'utils/addressHelpers'
import { getAstraExplorerLink } from 'utils'
import { FarmAuctionTag, CoreTag, DualTag } from 'components/Tags'
import { FarmWithStakedValue } from '../../types'

import HarvestAction from './HarvestAction'
import StakedAction from './StakedAction'
import Apr, { AprProps } from '../Apr'
import Multiplier, { MultiplierProps } from '../Multiplier'
import Liquidity, { LiquidityProps } from '../Liquidity'
import clsx from 'clsx'
import styles from './styles.module.scss'
import { Icon, IconEnum, Typography } from '@astraprotocol/astra-ui'

export interface ActionPanelProps {
	apr: AprProps
	multiplier: MultiplierProps
	liquidity: LiquidityProps
	details: FarmWithStakedValue
	userDataReady: boolean
	expanded: boolean
}

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({
	details,
	apr,
	multiplier,
	liquidity,
	userDataReady,
	expanded
}) => {
	const farm = details

	const { t } = useTranslation()
	const isActive = farm.multiplier !== '0X'
	const { quoteToken, token, dual } = farm
	// @todo change PANCAKE to DEX name
	const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
	const liquidityUrlPathParts = getLiquidityUrlPathParts({
		quoteTokenAddress: quoteToken.address,
		tokenAddress: token.address
	})
	const lpAddress = getAddress(farm.lpAddresses)
	const bsc = getAstraExplorerLink(lpAddress, 'address')
	const info = `/info/pool/${lpAddress}`

	return (
		<div className={clsx(styles.actionPanelContainer, { [styles.expanded]: expanded })}>
			<div style={{ minWidth: 200 }}>
				{isActive && (
					<div className={styles.stakeContainer}>
						<Typography.Link classes="font-400" href={`/add/${liquidityUrlPathParts}`}>
							{t('Get %symbol%', { symbol: lpLabel })}
							<Icon icon={IconEnum.ICON_EXTERNAL_LINK} classes="margin-left-xs link-color-useful" />
						</Typography.Link>
					</div>
				)}
				<Typography.Link classes="font-400" href={bsc}>
					{t('View Contract')}
					<Icon icon={IconEnum.ICON_EXTERNAL_LINK} classes="margin-left-xs link-color-useful" />
				</Typography.Link>
				<br />
				<Typography.Link classes="font-400" href={info}>
					{t('See Pair Info')}
					<Icon icon={IconEnum.ICON_EXTERNAL_LINK} classes="margin-left-xs link-color-useful" />
				</Typography.Link>
				<div className={styles.tagContainer}>
					{farm.isCommunity ? <FarmAuctionTag /> : <CoreTag />}
					{dual ? <DualTag /> : null}
				</div>
			</div>
			<div className={styles.valueContainer}>
				<div className="flex flex-justify-space-between flex-align-center margin-top-xs margin-bottom-xs">
					<span className="text text-sm">{t('APR')}</span>
					<Apr {...apr} />
				</div>
				<div className="flex flex-justify-space-between flex-align-center margin-top-xs margin-bottom-xs">
					<span className="text text-sm">{t('Multiplier')}</span>
					<Multiplier {...multiplier} />
				</div>
				<div className="flex flex-justify-space-between flex-align-center margin-top-xs margin-bottom-xs">
					<span className="text text-sm">{t('Liquidity')}</span>
					<Liquidity {...liquidity} />
				</div>
			</div>
			<div className={styles.actionPanelActionContainer}>
				<HarvestAction {...farm} userDataReady={userDataReady} />
				<StakedAction {...farm} userDataReady={userDataReady} lpLabel={lpLabel} displayApr={apr.value} />
			</div>
		</div>
	)
}

export default ActionPanel
