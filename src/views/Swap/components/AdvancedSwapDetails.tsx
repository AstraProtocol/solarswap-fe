import { Trade, TradeType } from '@solarswap/sdk'
// import { span } from '@solarswap/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from 'contexts/Localization'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/prices'
// import { AutoColumn } from 'components/Layout/Column'
// import QuestionHelper from 'components/QuestionHelper'
// import { Row, Row } from 'components/Layout/Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'
import { Row } from '@astraprotocol/astra-ui'
import QuestionHelper from 'components/QuestionHelper'

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
	const { t } = useTranslation()
	const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
	const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
	const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

	return (
		<div style={{ padding: '0 16px' }}>
			<Row style={{ justifyContent: 'space-between' }}>
				<Row>
					<span className="text text-base contrast-color-70">
						{isExactIn ? t('Minimum received') : t('Maximum sold')}
					</span>
					<QuestionHelper
						text={t(
							'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'
						)}
						ml="4px"
						placement="top-start"
					/>
				</Row>
				<span className="text text-base">
					{isExactIn
						? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${
								trade.outputAmount.currency.symbol
						  }` ?? '-'
						: `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${
								trade.inputAmount.currency.symbol
						  }` ?? '-'}
				</span>
			</Row>
			<Row>
				<Row>
					<span className="text text-base contrast-color-70">{t('Price Impact')}</span>
					<QuestionHelper
						text={t('The difference between the market price and estimated price due to trade size.')}
						ml="4px"
						placement="top-start"
					/>
				</Row>
				<FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
			</Row>

			<Row>
				<Row>
					<span className="text text-base contrast-color-70">{t('Liquidity Provider Fee')}</span>
					<QuestionHelper
						text={
							<>
								<span className="text text-sm">
									{t('For each trade a %amount% fee is paid', { amount: '0.25%' })}
								</span>
								<span className="text text-sm">
									- {t('%amount% to LP token holders', { amount: '0.2%' })}
								</span>
								<span className="text text-sm">
									- {t('%amount% to the Treasury', { amount: '0.03%' })}
								</span>
								<span className="text text-sm">
									- {t('%amount% towards ASTRA buyback', { amount: '0.05%' })}
								</span>
							</>
						}
						ml="4px"
						placement="top-start"
					/>
				</Row>
				<span className="text text-base">
					{realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
				</span>
			</Row>
		</div>
	)
}

export interface AdvancedSwapDetailsProps {
	trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
	const { t } = useTranslation()
	const [allowedSlippage] = useUserSlippageTolerance()

	const showRoute = Boolean(trade && trade.route.path.length > 2)

	return (
		<div>
			{trade && (
				<>
					<TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
					{showRoute && (
						<>
							<Row style={{ padding: '0 16px' }}>
								<span style={{ display: 'flex', alignItems: 'center' }}>
									<span className="text text-base">{t('Route')}</span>
									<QuestionHelper
										text={t(
											'Routing through these tokens resulted in the best price for your trade.'
										)}
										ml="4px"
										placement="top-start"
									/>
								</span>
								<SwapRoute trade={trade} />
							</Row>
						</>
					)}
				</>
			)}
		</div>
	)
}
