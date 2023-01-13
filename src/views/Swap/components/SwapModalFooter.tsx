import { useMemo, useState } from 'react'

import { Trade, TradeType } from '@solarswap/sdk'

import { useTranslation } from 'contexts/Localization'
import { Field } from 'state/swap/actions'
import {
	computeSlippageAdjustedAmounts,
	computeTradePriceBreakdown,
	formatExecutionPrice,
	warningSeverity
} from 'utils/prices'
// import { AutoColumn } from 'components/Layout/Column'
// import QuestionHelper from 'components/QuestionHelper'

import FormattedPriceImpact from './FormattedPriceImpact'
// import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
import { Icon, IconEnum, NormalButton, Row } from '@astraprotocol/astra-ui'
import styles from './styles.module.scss'
import QuestionHelper from 'components/QuestionHelper'
import { SwapCallbackError } from './SwapCallbackError'
import { TOTAL_FEE } from 'config/constants/info'
// const SwapModalFooterContainer = styled(AutoColumn)`
//   margin-top: 24px;
//   padding: 16px;
//   border-radius: ${({ theme }) => theme.radii.default};
//   border: 1px solid ${({ theme }) => theme.colors.cardBorder};
//   background-color: ${({ theme }) => theme.colors.background};
// `

export default function SwapModalFooter({
	trade,
	onConfirm,
	allowedSlippage,
	swapErrorMessage,
	disabledConfirm
}: {
	trade: Trade
	allowedSlippage: number
	onConfirm: () => void
	swapErrorMessage: string | undefined
	disabledConfirm: boolean
}) {
	const { t } = useTranslation()
	const [showInverted, setShowInverted] = useState<boolean>(false)
	const slippageAdjustedAmounts = useMemo(
		() => computeSlippageAdjustedAmounts(trade, allowedSlippage),
		[allowedSlippage, trade]
	)
	const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
	const severity = warningSeverity(priceImpactWithoutFee)

	return (
		<>
			<div className="margin-top-lg padding-md border border-base radius-lg margin-bottom-md same-bg-color-50">
				<Row className="flex-justify-space-between flex-align-center">
					<span className="text text-sm">{t('Price')}</span>
					<span
						className="text text-sm"
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							display: 'flex',
							textAlign: 'right',
							paddingLeft: '10px'
						}}
					>
						{formatExecutionPrice(trade, showInverted)}
						<div className={styles.viewBalanceMaxMini} onClick={() => setShowInverted(!showInverted)}>
							<Icon icon={IconEnum.ICON_SWAP_LEFT_RIGHT} classes="secondary-color-normal" />
						</div>
					</span>
				</Row>

				<Row>
					<Row className="flex-align-center">
						<span className="text text-sm margin-right-2xs">
							{trade.tradeType === TradeType.EXACT_INPUT ? t('Minimum received') : t('Maximum sold')}
						</span>
						<QuestionHelper
							text={t(
								'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'
							)}
						/>
					</Row>
					<Row className="flex-align-center flex-justify-end">
						<span className="text text-sm margin-right-2xs">
							{trade.tradeType === TradeType.EXACT_INPUT
								? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
								: slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
						</span>
						<span className="text text-sm">
							{trade.tradeType === TradeType.EXACT_INPUT
								? trade.outputAmount.currency.symbol
								: trade.inputAmount.currency.symbol}
						</span>
					</Row>
				</Row>
				<Row>
					<Row className="flex-align-center">
						<span className="text text-sm margin-right-2xs">{t('Price Impact')}</span>
						<QuestionHelper
							text={t('The difference between the market price and your price due to trade size.')}
						/>
					</Row>
					<FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
				</Row>
				<Row>
					<Row className="flex-align-center" style={{ position: 'relative' }}>
						<span className="text text-sm margin-right-2xs">{t('Liquidity Provider Fee')}</span>
						<QuestionHelper
							text={`
									${t('For each trade a %amount% fee is paid', { amount: `${TOTAL_FEE * 100}%` })}
									${t('%amount% to LP token holders', { amount: `${TOTAL_FEE * 100}%` })}
									`}
						/>
					</Row>
					<span className="text text-sm">
						{realizedLPFee
							? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}`
							: '-'}
					</span>
				</Row>
			</div>

			<Row>
				<NormalButton
					classes={{ other: 'text text-base width-100' }}
					onClick={onConfirm}
					disabled={disabledConfirm}
					id="confirm-swap-or-send"
				>
					{severity > 2 ? t('Swap Anyway') : t('Confirm Swap')}
				</NormalButton>

				{swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
			</Row>
		</>
	)
}
