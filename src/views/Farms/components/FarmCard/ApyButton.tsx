import { IconButton, IconEnum } from '@astraprotocol/astra-ui'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { useModal } from 'components/Modal'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from 'contexts/Localization'
import { useFarmUser, useLpTokenPrice } from 'state/farms/hooks'
import styles from './styles.module.scss'

export interface ApyButtonProps {
	variant: 'text' | 'text-and-button'
	pid: number
	lpSymbol: string
	lpLabel?: string
	multiplier: string
	astraPrice?: BigNumber
	apr?: number
	displayApr?: string
	addLiquidityUrl?: string
}

const ApyButton: React.FC<ApyButtonProps> = ({
	variant,
	pid,
	lpLabel,
	lpSymbol,
	astraPrice,
	apr,
	multiplier,
	displayApr,
	addLiquidityUrl
}) => {
	const { t } = useTranslation()
	const lpPrice = useLpTokenPrice(lpSymbol)
	const { tokenBalance, stakedBalance } = useFarmUser(pid)
	const [onPresentApyModal] = useModal(
		<RoiCalculatorModal
			linkLabel={t('Get %symbol%', { symbol: lpLabel })}
			stakingTokenBalance={stakedBalance.plus(tokenBalance)}
			stakingTokenSymbol={lpSymbol}
			stakingTokenPrice={lpPrice.toNumber()}
			earningTokenPrice={astraPrice.toNumber()}
			apr={apr}
			multiplier={multiplier}
			displayApr={displayApr}
			linkHref={addLiquidityUrl}
			isFarm
		/>
	)

	const handleClickButton = (event): void => {
		event.stopPropagation()
		onPresentApyModal()
	}

	return (
		<div className={clsx(styles.apyLabelContainer, 'flex flex-align-center')} onClick={handleClickButton}>
			<span className="money money-sm">{displayApr}%</span>
			{variant === 'text-and-button' && <IconButton icon={IconEnum.ICON_CALC} classes="margin-left-xs text-xs" />}
		</div>
	)
}

export default ApyButton
