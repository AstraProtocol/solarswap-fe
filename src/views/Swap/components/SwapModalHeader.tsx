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
import { Icon, IconEnum, NormalButton, Row } from '@astraprotocol/astra-ui'

export default function SwapModalHeader({
	trade,
	allowedSlippage,
	recipient,
	showAcceptChanges,
	onAcceptChanges,
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
		[trade, allowedSlippage],
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
					symbol,
			  })
			: t('Input is estimated. You will sell at most %amount% %symbol% or the transaction will revert.', {
					amount,
					symbol,
			  })

	const [estimatedText, transactionRevertText] = tradeInfoText.split(`${amount} ${symbol}`)

	const truncatedRecipient = recipient ? truncateHash(recipient) : ''

	const recipientInfoText = t('Output will be sent to %recipient%', {
		recipient: truncatedRecipient,
	})

	const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

	return (
		<AutoColumn gap="md">
			<Row>
				<Row>
					<CurrencyLogo currency={trade.inputAmount.currency} size={24} />
					<span
						className="text text-lg margin-left-sm"
						color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'primary' : 'text'}
					>
						{trade.inputAmount.toSignificant(6)}
					</span>
				</Row>
				<span className="text text-lg margin-left-sm">{trade.inputAmount.currency.symbol}</span>
			</Row>
			<div className="flex flex-justify-center">
				<Icon icon={IconEnum.ICON_DOWN} className="text-lg" />
			</div>
			<Row>
				<Row>
					<CurrencyLogo currency={trade.outputAmount.currency} size={24} />
					<div
						className="text text-lg margin-left-sm"
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
				<span className="text text-lg margin-left-sm">{trade.outputAmount.currency.symbol}</span>
			</Row>
			{showAcceptChanges ? (
				<div className="flex-justify-start">
					<Row>
						<Row>
							<Icon icon={IconEnum.ICON_WARNING} classes="margin-right-sm" />
							<span className="text text-base text-bold"> {t('Price Updated')}</span>
						</Row>
						<NormalButton onClick={onAcceptChanges}>{t('Accept')}</NormalButton>
					</Row>
				</div>
			) : null}
			<div className="flex col flex-justify-start padding-left-md">
				<span className="text text-sm width-100">
					{estimatedText}
					<b>
						{amount} {symbol}
					</b>
					{transactionRevertText}
				</span>
			</div>
			{recipient !== null ? (
				<div className="flex col flex-justify-start padding-left-sm">
					<span color="textSubtle">
						{recipientSentToText}
						<b title={recipient}>{truncatedRecipient}</b>
						{postSentToText}
					</span>
				</div>
			) : null}
		</AutoColumn>
	)
}
