import React, { useCallback } from 'react'
import { Row, NormalButton } from '@astraprotocol/astra-ui'
import { useTranslation } from 'contexts/Localization'
import TransactionConfirmationModal, {
	ConfirmationModalContent,
	TransactionErrorContent
} from 'components/TransactionConfirmationModal'
import { AutoColumn } from 'components/Layout/Column'
import { Field } from 'state/burn/actions'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { ApprovalState } from 'hooks/useApproveCallback'
import { Currency, CurrencyAmount, Pair, Percent, Token, TokenAmount } from '@solarswap/sdk'

interface ConfirmRemoveSingleLiquidityModalProps {
	onDismiss?: () => void
	title: string
	customOnDismiss: () => void
	attemptingTxn: boolean
	pair?: Pair
	hash: string
	pendingText: string
	parsedAmounts: {
		[Field.LIQUIDITY_PERCENT]: Percent
		[Field.LIQUIDITY]?: TokenAmount
		[Field.CURRENCY_A]?: CurrencyAmount
		[Field.CURRENCY_B]?: CurrencyAmount
	}
	allowedSlippage: number
	onRemove: () => void
	liquidityErrorMessage: string
	approval: ApprovalState
	signatureData?: any
	tokenA: Token
	tokenB: Token
	currencyA: Currency | null | undefined
	currencyB: Currency | null | undefined
}

const ConfirmRemoveSingleLiquidityModal = ({
	title,
	onDismiss,
	customOnDismiss,
	attemptingTxn,
	pair,
	hash,
	approval,
	signatureData,
	pendingText,
	parsedAmounts,
	allowedSlippage,
	onRemove,
	liquidityErrorMessage,
	tokenA,
	tokenB,
	currencyA,
	currencyB
}: ConfirmRemoveSingleLiquidityModalProps) => {
	const { t } = useTranslation()

	const slippage = allowedSlippage / 100

	const slippageText = t(
		'Output is estimated. If the price changes by more than %slippage%% your transaction will revert.',
		{ slippage }
	)

	const [estimatedText, transactionRevertText] = slippageText.split(`${slippage}%`)

	const modalHeader = useCallback(() => {
		return (
			<AutoColumn gap="md">
				<Row className="flex-justify-space-between flex-align-end">
					<span className="text text-xl">{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</span>
					<div className="flex padding-2xs">
						<CurrencyLogo currency={currencyA} size={24} />
						<span className="text text-xl margin-left-sm">{currencyA?.symbol}</span>
					</div>
				</Row>
				{/* <Row>
          <AddIcon width="16px" />
        </Row>
        <Row className='flex-justify-space-between' align="flex-end">
          <span className='text' fontSize="24px">{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</span>
          <Row gap="4px">
            <CurrencyLogo currency={currencyB} size="24px" />
            <span className='text' fontSize="24px" ml="10px">
              {currencyB?.symbol}
            </span>
          </Row>
        </Row> */}

				<div className="flex col flex-justify-start padding-left-md">
					<span className="text text-sm width-100">
						{estimatedText}
						<b>{slippage}%</b>
						{transactionRevertText}
					</span>
				</div>
			</AutoColumn>
		)
	}, [allowedSlippage, currencyA, currencyB, parsedAmounts, t])

	const modalBottom = useCallback(() => {
		return (
			<>
				<div className="margin-top-lg padding-md border border-base radius-lg margin-bottom-md same-bg-color-50">
					<Row className="flex-justify-space-between">
						<span className="text text-sm">
							LP{' '}
							{t('%assetA%/%assetB% Burned', {
								assetA: currencyA?.symbol ?? '',
								assetB: currencyB?.symbol ?? ''
							})}
						</span>
						<div className="flex">
							<DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin />
							<span className="text text-sm">{parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}</span>
						</div>
					</Row>
					{pair && (
						<>
							<Row className="flex-justify-space-between">
								<span className="text text-sm">{t('Price')}</span>
								<span className="text text-sm">
									1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'}{' '}
									{currencyB?.symbol}
								</span>
							</Row>
							<Row className="flex-justify-space-between">
								<div />
								<span className="text text-sm">
									1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'}{' '}
									{currencyA?.symbol}
								</span>
							</Row>
						</>
					)}
				</div>
				<NormalButton
					classes={{ other: 'text text-base width-100 margin-top-md' }}
					disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
					onClick={onRemove}
				>
					{t('Confirm')}
				</NormalButton>
			</>
		)
	}, [currencyA, currencyB, parsedAmounts, approval, onRemove, pair, signatureData, tokenA, tokenB, t])

	const confirmationContent = useCallback(
		() =>
			liquidityErrorMessage ? (
				<TransactionErrorContent onDismiss={onDismiss} message={liquidityErrorMessage} />
			) : (
				<ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
			),
		[onDismiss, modalBottom, modalHeader, liquidityErrorMessage]
	)

	return (
		<TransactionConfirmationModal
			title={title}
			onDismiss={onDismiss}
			customOnDismiss={customOnDismiss}
			attemptingTxn={attemptingTxn}
			hash={hash}
			content={confirmationContent}
			pendingText={pendingText}
		/>
	)
}

export default ConfirmRemoveSingleLiquidityModal
