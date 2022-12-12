import React, { useCallback } from 'react'
import { Currency, CurrencyAmount, Fraction, Percent, Token, TokenAmount } from '@solarswap/sdk'
import { Flex, InjectedModalProps, Text } from '@solarswap/uikit'
import { useTranslation } from 'contexts/Localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import { AutoColumn } from 'components/Layout/Column'
import Row from 'components/Layout/Row'
import { Field } from 'state/burn/actions'
import { DoubleCurrencyLogo } from 'components/Logo'
import ConfirmAddModalBottom from '../../AddLiquidity/ConfirmAddModalBottom'
import ConfirmAddSingleModalBottom from '../../AddLiquiditySingle/ConfirmAddModalBottom'

interface ConfirmAddLiquidityModalProps {
  title: string
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

const ConfirmAddLiquidityModal: React.FC<InjectedModalProps & ConfirmAddLiquidityModalProps> = ({
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
}) => {
  const { t } = useTranslation()

  const modalHeader = useCallback(() => {
    return noLiquidity ? (
      <Flex alignItems="center">
        <Text fontSize="48px" marginRight="10px">
          {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}
        </Text>
        <DoubleCurrencyLogo
          currency0={currencies[Field.CURRENCY_A]}
          currency1={currencies[Field.CURRENCY_B]}
          size={30}
        />
      </Flex>
    ) : (
      <AutoColumn>
        <Flex alignItems="center">
          <Text fontSize="48px" marginRight="10px">
            {liquidityMinted?.toSignificant(6)}
          </Text>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </Flex>
        <Row>
          <Text fontSize="24px">
            {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol} Pool Tokens`}
          </Text>
        </Row>
        <Text small textAlign="left" my="24px">
          {t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
            slippage: allowedSlippage / 100,
          })}
        </Text>
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
