import { useMemo } from 'react'
import { Trade, TradeType } from '@solarswap/sdk'
import { Field } from 'state/swap/actions'
import { useTranslation } from 'contexts/Localization'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
// import { Row, Row } from 'components/Layout/Row'
import truncateHash from 'utils/truncateHash'
// import { TruncatedText, SwapShowAcceptChanges } from './styleds'
import { NormalButton, Row } from '@astraprotocol/astra-ui'

export default function SwapModalHeader({
	trade,
	allowedSlippage,
	recipient,
	showAcceptChanges,
	onAcceptChanges
}: {
	trade: Trade
	allowedSlippage: number
	recipient: string | null
	showAcceptChanges: boolean
	onAcceptChanges: () => void
}) {
	const { t } = useTranslation()
	const slippageAdjustedAmounts = useMemo(
		() => computeSlippageAdjustedAmounts(trade, allowedSlippage),
		[trade, allowedSlippage]
	)
	const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
	const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

	const amount =
		trade.tradeType === TradeType.EXACT_INPUT
			? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)
			: slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)
	const symbol =
		trade.tradeType === TradeType.EXACT_INPUT
			? trade.outputAmount.currency.symbol
			: trade.inputAmount.currency.symbol

	const tradeInfoText =
		trade.tradeType === TradeType.EXACT_INPUT
			? t('Output is estimated. You will receive at least %amount% %symbol% or the transaction will revert.', {
					amount,
					symbol
			  })
			: t('Input is estimated. You will sell at most %amount% %symbol% or the transaction will revert.', {
					amount,
					symbol
			  })

	const [estimatedText, transactionRevertText] = tradeInfoText.split(`${amount} ${symbol}`)

	const truncatedRecipient = recipient ? truncateHash(recipient) : ''

	const recipientInfoText = t('Output will be sent to %recipient%', {
		recipient: truncatedRecipient
	})

	const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

	return (
		<AutoColumn gap="md">
			<Row align="flex-end">
				<Row gap="0px">
					<CurrencyLogo currency={trade.inputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
					<span
						fontSize="24px"
						color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'primary' : 'text'}
					>
						{trade.inputAmount.toSignificant(6)}
					</span>
				</Row>
				<Row gap="0px">
					<span fontSize="24px" ml="10px">
						{trade.inputAmount.currency.symbol}
					</span>
				</Row>
			</Row>
			<Row>{/* <ArrowDownIcon width="16px" ml="4px" /> */}</Row>
			<Row align="flex-end">
				<Row gap="0px">
					<CurrencyLogo currency={trade.outputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
					<div
						fontSize="24px"
						color={
							priceImpactSeverity > 2
								? 'failure'
								: showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
								? 'primary'
								: 'text'
						}
					>
						{trade.outputAmount.toSignificant(6)}
					</div>
				</Row>
				<Row gap="0px">
					<span fontSize="24px" ml="10px">
						{trade.outputAmount.currency.symbol}
					</span>
				</Row>
			</Row>
			{showAcceptChanges ? (
				<div justify="flex-start" gap="0px">
					<Row>
						<Row>
							{/* <ErrorIcon mr="8px" /> */}
							<span bold> {t('Price Updated')}</span>
						</Row>
						<NormalButton onClick={onAcceptChanges}>{t('Accept')}</NormalButton>
					</Row>
				</div>
			) : null}
			<AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px' }}>
				<span small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
					{estimatedText}
					<b>
						{amount} {symbol}
					</b>
					{transactionRevertText}
				</span>
			</AutoColumn>
			{recipient !== null ? (
				<AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
					<span color="textSubtle">
						{recipientSentToText}
						<b title={recipient}>{truncatedRecipient}</b>
						{postSentToText}
					</span>
				</AutoColumn>
			) : null}
		</AutoColumn>
	)
}
