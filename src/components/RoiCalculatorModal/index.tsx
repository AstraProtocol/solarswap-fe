import { useRef, useEffect } from 'react'

import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import RoiCalculatorFooter from './RoiCalculatorFooter'
import RoiCard from './RoiCard'
import useRoiCalculatorReducer, { CalculatorMode, EditingCurrency } from './useRoiCalculatorReducer'
import AnimatedArrow from './AnimatedArrow'
import { ButtonMenu, ButtonMenuItem, Checkbox, Icon, IconButton, IconEnum, NormalButton } from '@astraprotocol/astra-ui'
import { Modal } from 'components/Modal'
import styles from './styles.module.scss'
import clsx from 'clsx'
import { BalanceInput } from 'components/BalanceInput'
import { useTooltip } from 'hooks/useTooltip'

interface RoiCalculatorModalProps {
	onDismiss?: () => void
	onBack?: () => void
	earningTokenPrice: number
	apr: number
	displayApr?: string
	linkLabel: string
	linkHref: string
	stakingTokenBalance: BigNumber
	stakingTokenSymbol: string
	stakingTokenPrice: number
	earningTokenSymbol?: string
	multiplier?: string
	autoCompoundFrequency?: number
	performanceFee?: number
	isFarm?: boolean
	initialValue?: string
}

const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
	onDismiss,
	onBack,
	earningTokenPrice,
	apr,
	displayApr,
	linkLabel,
	linkHref,
	stakingTokenBalance,
	stakingTokenSymbol,
	stakingTokenPrice,
	multiplier,
	initialValue,
	earningTokenSymbol = 'ASA',
	autoCompoundFrequency = 0,
	performanceFee = 0,
	isFarm = false,
}) => {
	const { t } = useTranslation()
	const { account } = useActiveWeb3React()
	const balanceInputRef = useRef<HTMLInputElement | null>(null)

	const {
		state,
		setPrincipalFromUSDValue,
		setPrincipalFromTokenValue,
		setStakingDuration,
		toggleCompounding,
		toggleEditingCurrency,
		setCompoundingFrequency,
		setCalculatorMode,
		setTargetRoi,
	} = useRoiCalculatorReducer(stakingTokenPrice, earningTokenPrice, apr, autoCompoundFrequency, performanceFee)

	const { compounding, activeCompoundingIndex, stakingDuration, editingCurrency } = state.controls
	const { principalAsUSD, principalAsToken } = state.data

	// Auto-focus input on opening modal
	useEffect(() => {
		if (balanceInputRef.current) {
			balanceInputRef.current.focus()
		}
	}, [])

	// If user comes to calculator from staking modal - initialize with whatever they put in there
	useEffect(() => {
		if (initialValue) {
			setPrincipalFromTokenValue(initialValue)
		}
	}, [initialValue, setPrincipalFromTokenValue])

	const { targetRef, tooltip, tooltipVisible } = useTooltip(
		isFarm
			? t('“My Balance” here includes both LP Tokens in your wallet, and LP Tokens already staked in this farm.')
			: t(
					'“My Balance” here includes both %assetSymbol% in your wallet, and %assetSymbol% already staked in this pool.',
					{ assetSymbol: stakingTokenSymbol },
			  ),
		{ placement: 'top-end', tooltipOffset: [20, 10] },
	)

	const onBalanceFocus = () => {
		setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
	}

	const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
	const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
	const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
	const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
	const onUserInput =
		editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

	return (
		<Modal
			className={styles.roiCalculatorModal}
			title={t('ROI Calculator')}
			onDismiss={onBack || onDismiss}
			onBack={onBack ?? null}
		>
			<div className={styles.scrollableContainer}>
				<div className="flex col margin-bottom-sm">
					<span className="text text-xs text-bold text-uppercase contrast-color-70 margin-bottom-xs">
						{t('%asset% staked', { asset: stakingTokenSymbol })}
					</span>
					<BalanceInput
						currencyValue={`${conversionValue} ${conversionUnit}`}
						innerRef={balanceInputRef}
						placeholder="0.00"
						value={editingValue}
						unit={editingUnit}
						onUserInput={onUserInput}
						switchEditingUnits={toggleEditingCurrency}
						onFocus={onBalanceFocus}
					/>
					<div className="flex flex-justify-space-between margin-top-xs flex-align-center">
						<NormalButton variant="default" onClick={() => setPrincipalFromUSDValue('100')}>
							$100
						</NormalButton>
						<NormalButton variant="default" onClick={() => setPrincipalFromUSDValue('1000')}>
							$1000
						</NormalButton>
						<NormalButton
							disabled={!stakingTokenBalance.isFinite() || stakingTokenBalance.lte(0) || !account}
							variant="default"
							onClick={() =>
								setPrincipalFromUSDValue(
									getBalanceNumber(stakingTokenBalance.times(stakingTokenPrice)).toString(),
								)
							}
						>
							{t('My Balance').toLocaleUpperCase()}
						</NormalButton>
						<span ref={targetRef}>
							<Icon icon={IconEnum.ICON_HELP} />
						</span>
						{tooltipVisible && tooltip}
					</div>
					<span className="text text-xs margin-top-xl text-bold text-uppercase margin-bottom-xs contrast-color-70">
						{t('Staked for')}
					</span>
					<ButtonMenu
						className={clsx(styles.buttonMenu)}
						activeIndex={stakingDuration}
						onItemClick={setStakingDuration}
						size="sm"
					>
						<ButtonMenuItem variant="tertiary">{t('1D')}</ButtonMenuItem>
						<ButtonMenuItem variant="tertiary">{t('7D')}</ButtonMenuItem>
						<ButtonMenuItem variant="tertiary">{t('30D')}</ButtonMenuItem>
						<ButtonMenuItem variant="tertiary">{t('1Y')}</ButtonMenuItem>
						<ButtonMenuItem variant="tertiary">{t('5Y')}</ButtonMenuItem>
					</ButtonMenu>
					{autoCompoundFrequency === 0 && (
						<>
							<span className="text text-xs margin-top-xl text-bold text-uppercase contrast-color-70 margin-bottom-xs">
								{t('Compounding every')}
							</span>
							<div className="flex flex-align-center">
								<div className="flex flex-1">
									<Checkbox scale="sm" checked={compounding} onChange={toggleCompounding} />
								</div>
								<div className="flex" style={{ flex: 6 }}>
									<ButtonMenu
										disabled={!compounding}
										className={clsx(styles.buttonMenu, { [styles.disabled]: !compounding })}
										activeIndex={activeCompoundingIndex}
										onItemClick={setCompoundingFrequency}
										size="sm"
									>
										<ButtonMenuItem>{t('1D')}</ButtonMenuItem>
										<ButtonMenuItem>{t('7D')}</ButtonMenuItem>
										<ButtonMenuItem>{t('14D')}</ButtonMenuItem>
										<ButtonMenuItem>{t('30D')}</ButtonMenuItem>
									</ButtonMenu>
								</div>
							</div>
						</>
					)}
				</div>
				<AnimatedArrow calculatorState={state} />
				<RoiCard
					earningTokenSymbol={earningTokenSymbol}
					calculatorState={state}
					setTargetRoi={setTargetRoi}
					setCalculatorMode={setCalculatorMode}
				/>
			</div>
			<RoiCalculatorFooter
				isFarm={isFarm}
				apr={apr}
				displayApr={displayApr}
				autoCompoundFrequency={autoCompoundFrequency}
				multiplier={multiplier}
				linkLabel={linkLabel}
				linkHref={linkHref}
				performanceFee={performanceFee}
			/>
		</Modal>
	)
}

export default RoiCalculatorModal
