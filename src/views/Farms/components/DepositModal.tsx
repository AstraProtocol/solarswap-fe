import BigNumber from 'bignumber.js'
import { useCallback, useMemo, useState } from 'react'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { Icon, IconButton, IconEnum, NormalButton, Typography } from '@astraprotocol/astra-ui'
import Skeleton from 'react-loading-skeleton'
import { Modal } from 'components/Modal'
import styles from './styles.module.scss'
import clsx from 'clsx'
import ModalInput from './Modal/ModalInput'
import ModalActions from './Modal/ModalActions'
import Dots from '../../../components/Loader/Dots'

interface DepositModalProps {
	max: BigNumber
	stakedBalance: BigNumber
	multiplier?: string
	lpPrice: BigNumber
	lpLabel?: string
	onConfirm: (amount: string) => void
	onDismiss?: () => void
	tokenName?: string
	apr?: number
	displayApr?: string
	addLiquidityUrl?: string
	astraPrice?: BigNumber
}

const DepositModal: React.FC<DepositModalProps> = ({
	max,
	stakedBalance,
	onConfirm,
	onDismiss,
	tokenName = '',
	multiplier,
	displayApr,
	lpPrice,
	lpLabel,
	apr,
	addLiquidityUrl,
	astraPrice,
}) => {
	const [val, setVal] = useState('')
	const [pendingTx, setPendingTx] = useState(false)
	const [showRoiCalculator, setShowRoiCalculator] = useState(false)
	const { t } = useTranslation()
	const fullBalance = useMemo(() => {
		return getFullDisplayBalance(max)
	}, [max])

	const lpTokensToStake = new BigNumber(val)
	const fullBalanceNumber = new BigNumber(fullBalance)

	const usdToStake = lpTokensToStake.times(lpPrice)

	const interestBreakdown = getInterestBreakdown({
		principalInUSD: !lpTokensToStake.isNaN() ? usdToStake.toNumber() : 0,
		apr,
		earningTokenPrice: astraPrice.toNumber(),
	})

	const annualRoi = astraPrice.times(interestBreakdown[3])
	const annualRoiAsNumber = annualRoi.toNumber()
	const formattedAnnualRoi = formatNumber(annualRoiAsNumber, annualRoi.gt(10000) ? 0 : 2, annualRoi.gt(10000) ? 0 : 2)

	const handleChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			if (e.currentTarget.validity.valid) {
				setVal(e.currentTarget.value.replace(/,/g, '.'))
			}
		},
		[setVal],
	)

	const handleSelectMax = useCallback(() => {
		setVal(fullBalance)
	}, [fullBalance, setVal])

	if (showRoiCalculator) {
		return (
			<RoiCalculatorModal
				linkLabel={t('Get %symbol%', { symbol: lpLabel })}
				stakingTokenBalance={stakedBalance.plus(max)}
				stakingTokenSymbol={tokenName}
				stakingTokenPrice={lpPrice.toNumber()}
				earningTokenPrice={astraPrice.toNumber()}
				apr={apr}
				multiplier={multiplier}
				displayApr={displayApr}
				linkHref={addLiquidityUrl}
				isFarm
				initialValue={val}
				onBack={() => setShowRoiCalculator(false)}
			/>
		)
	}

	return (
		<Modal title={t('Stake LP tokens')} style={{ minWidth: 470 }} onDismiss={onDismiss}>
			<ModalInput
				value={val}
				onSelectMax={handleSelectMax}
				onChange={handleChange}
				max={fullBalance}
				symbol={tokenName}
				addLiquidityUrl={addLiquidityUrl}
				inputTitle={t('Stake')}
			/>
			<div className="flex flex-align-center flex-justify-space-between margin-top-lg margin-bottom-lg">
				<span className="text text-sm margin-right-sm contrast-color-70">
					{t('Annual ROI at current rates')}:
				</span>
				{Number.isFinite(annualRoiAsNumber) ? (
					<div
						className="flex link flex-align-center"
						onClick={() => {
							setShowRoiCalculator(true)
						}}
					>
						<span className={clsx('money money-sm margin-right-xs', styles.annualRoiDisplay)}>
							${formattedAnnualRoi}
						</span>
						<IconButton size="sm" icon={IconEnum.ICON_CALC} />
					</div>
				) : (
					<Skeleton width={60} />
				)}
			</div>
			<ModalActions>
				<NormalButton
					variant="default"
					onClick={onDismiss}
					classes={{ other: 'width-100' }}
					disabled={pendingTx}
				>
					<span className="text text-base">{t('Cancel')}</span>
				</NormalButton>
				<NormalButton
					classes={{ other: 'width-100' }}
					disabled={
						pendingTx ||
						!lpTokensToStake.isFinite() ||
						lpTokensToStake.eq(0) ||
						lpTokensToStake.gt(fullBalanceNumber)
					}
					onClick={async () => {
						setPendingTx(true)
						await onConfirm(val)
						onDismiss?.()
						setPendingTx(false)
					}}
				>
					<span className="text text-base">{pendingTx ? <Dots>{t('Confirming')}</Dots> : t('Confirm')}</span>
				</NormalButton>
			</ModalActions>
			<Typography.Link href={addLiquidityUrl} classes="margin-top-md text-center">
				{t('Get %symbol%', { symbol: tokenName })}
				<Icon icon={IconEnum.ICON_EXTERNAL_LINK} classes="margin-left-xs link-color-useful" />
			</Typography.Link>
		</Modal>
	)
}

export default DepositModal
