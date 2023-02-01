import React, { useCallback } from 'react'
import { Currency, CurrencyAmount, Fraction, Percent, Token, TokenAmount } from '@solarswap/sdk'
// import { Flex, InjectedModalProps, Text } from '@solarswap/uikit'
import { NormalButton, Icon, Row, Message } from '@astraprotocol/astra-ui'
import { useTranslation } from 'contexts/Localization'
import TransactionConfirmationModal, {
	ConfirmationModalContent,
	TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import { AutoColumn } from 'components/Layout/Column'
// import Row from 'components/Layout/Row'
import { Field } from 'state/burn/actions'
import { DoubleCurrencyLogo } from 'components/Logo'
import ConfirmAddModalBottom from '../../AddLiquidity/ConfirmAddModalBottom'
import ConfirmAddSingleModalBottom from '../../AddLiquiditySingle/ConfirmAddModalBottom'

interface ConfirmAddLiquidityModalProps {
	title: string
	onDismiss?: () => void
	customOnDismiss: () => void
	attemptingTxn: boolean
	hash: string
	pendingText: string
	currencies: { [field in Field]?: Currency }
	noLiquidity: boolean
	allowedSlippage: number
	liquidityErrorMessage: string
	price: Fraction
	parsedAmounts: { [field in Field]?: CurrencyAmount }
	onAdd: () => void
	poolTokenPercentage: Percent
	liquidityMinted: TokenAmount
	currencyToAdd: Token
	isSingleLiquidity?: boolean
}

const ConfirmAddLiquidityModal = ({
	title,
	onDismiss,
	customOnDismiss,
	attemptingTxn,
	hash,
	pendingText,
	price,
	currencies,
	noLiquidity,
	allowedSlippage,
	parsedAmounts,
	liquidityErrorMessage,
	onAdd,
	poolTokenPercentage,
	liquidityMinted,
	currencyToAdd,
	isSingleLiquidity,
}: ConfirmAddLiquidityModalProps) => {
	const { t } = useTranslation()

	const slippage = allowedSlippage / 100

	const slippageText = t(
		'Output is estimated. If the price changes by more than %slippage%% your transaction will revert.',
		{ slippage },
	)

	const [estimatedText, transactionRevertText] = slippageText.split(`${slippage}%`)

	const modalHeader = useCallback(() => {
		return noLiquidity ? (
			<div className="flex flex-align-center">
				<span className="text text-2xl margin-right-md">
					{`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}
				</span>
				<DoubleCurrencyLogo
					currency0={currencies[Field.CURRENCY_A]}
					currency1={currencies[Field.CURRENCY_B]}
					size={30}
				/>
			</div>
		) : (
			<AutoColumn>
				<div className="flex flex-align-center">
					<span className="text text-2xl margin-right-md">{liquidityMinted?.toSignificant(6)}</span>
					<DoubleCurrencyLogo
						currency0={currencies[Field.CURRENCY_A]}
						currency1={currencies[Field.CURRENCY_B]}
						size={30}
					/>
				</div>
				<Row>
					<span className="text text-lg margin-bottom-md">
						{`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol} Pool Tokens`}
					</span>
				</Row>
				<div className="flex col flex-justify-start padding-left-md">
					<span className="text text-sm width-100">
						{estimatedText}
						<b>{slippage}%</b>
						{transactionRevertText}
					</span>
				</div>
			</AutoColumn>
		)
	}, [currencies, liquidityMinted, allowedSlippage, noLiquidity, t])

	const modalBottom = useCallback(() => {
		if (isSingleLiquidity)
			return (
				<ConfirmAddSingleModalBottom
					price={price}
					currencies={currencies}
					parsedAmounts={parsedAmounts}
					noLiquidity={noLiquidity}
					onAdd={onAdd}
					poolTokenPercentage={poolTokenPercentage}
				/>
			)
		return (
			<ConfirmAddModalBottom
				price={price}
				currencies={currencies}
				parsedAmounts={parsedAmounts}
				noLiquidity={noLiquidity}
				onAdd={onAdd}
				poolTokenPercentage={poolTokenPercentage}
			/>
		)
	}, [currencies, isSingleLiquidity, noLiquidity, parsedAmounts, poolTokenPercentage, price])

	const confirmationContent = useCallback(
		() =>
			liquidityErrorMessage ? (
				<TransactionErrorContent onDismiss={onDismiss} message={liquidityErrorMessage} />
			) : (
				<ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
			),
		[onDismiss, modalBottom, modalHeader, liquidityErrorMessage],
	)

	return (
		<TransactionConfirmationModal
			title={title}
			onDismiss={onDismiss}
			customOnDismiss={customOnDismiss}
			attemptingTxn={attemptingTxn}
			currencyToAdd={currencyToAdd}
			hash={hash}
			content={confirmationContent}
			pendingText={pendingText}
		/>
	)
}

export default ConfirmAddLiquidityModal
