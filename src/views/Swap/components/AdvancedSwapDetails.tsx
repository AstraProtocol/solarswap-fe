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
import { LP_HOLDERS_FEE, TOTAL_FEE, TREASURY_FEE } from 'config/constants/info'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
	const { t } = useTranslation()
	const { isMobile } = useMatchBreakpoints()
	const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
	const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
	const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

	return (
		<div style={{ padding: '0 16px' }}>
			<Row style={{ justifyContent: 'space-between' }}>
				<Row className="flex flex-align-center">
					<span className="text text-sm contrast-color-70 margin-right-2xs">
						{isExactIn ? t('Minimum received') : t('Maximum sold')}
					</span>
					<QuestionHelper
						text={t(
							'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
						)}
					/>
				</Row>
				<span className="text text-sm">
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
				<Row className="flex flex-align-center">
					<span className="text text-sm contrast-color-70 margin-right-2xs">{t('Price Impact')}</span>
					<QuestionHelper
						text={t('The difference between the market price and estimated price due to trade size.')}
					/>
				</Row>
				<FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
			</Row>

			<Row>
				<Row className="flex flex-align-center">
					<span className="text text-sm contrast-color-70 margin-right-2xs">
						{t('Liquidity Provider Fee')}
					</span>
					<QuestionHelper
						text={`
							${t('For each trade a %amount% fee is paid', { amount: `${TOTAL_FEE * 100}%` })},
							${t('%amount% to LP token holders', { amount: `${LP_HOLDERS_FEE * 100}%` })},
							${t('%amount% to the Treasury', { amount: `${TREASURY_FEE * 100}%` })}
							`}
						placement={isMobile ? 'top-start' : 'right'}
						// - ${t('%amount% to LP token holders', { amount: `${TOTAL_FEE * 100}%` })}
						// - ${t('%amount% to the Treasury', { amount: '0.03%' })}
						// - ${t('%amount% towards ASTRA buyback', { amount: '0.05%' })}
						// placement="top-start"
					/>
				</Row>
				<span className="text text-sm">
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
									<span className="text text-sm">{t('Route')}</span>
									<QuestionHelper
										text={t(
											'Routing through these tokens resulted in the best price for your trade.',
										)}
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
