import { useCallback, useEffect, useMemo, useState } from 'react'
// import styled from 'styled-components'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { useRouter } from 'next/router'
import { Currency, currencyEquals, ETHER, Percent, WETH } from '@solarswap/sdk'
// import { Slider } from '@solarswap/uikit'
import useModal from 'components/Modal/useModal'
import { withToast, Row, Icon, NormalButton, Slider, IconEnum } from '@astraprotocol/astra-ui'
import { BigNumber } from '@ethersproject/bignumber'
import { useTranslation } from 'contexts/Localization'
import { CHAIN_ID } from 'config/constants/networks'
import CircleLoader from 'components/Loader/CircleLoader'
import { AutoColumn, ColumnCenter } from '../../components/Layout/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { MinimalPositionCard } from '../../components/PositionCard'
import { AppHeader, AppBody } from '../../components/App'
// import { AutoRow } from '../../components/Layout/Row'
import ButtonConnect from 'components/ButtonConnect'
import { LightGreyCard } from '../../components/Card'

import { CurrencyLogo } from '../../components/Logo'
import { ZAP_ADDRESS } from '../../config/constants'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { usePairContract } from '../../hooks/useContract'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'

import { useTransactionAdder } from '../../state/transactions/hooks'
import StyledInternalLink from '../../components/Links'
import { calculateGasMargin, calculateSlippageAmount, getZapInContract } from '../../utils'
import { currencyId } from '../../utils/currencyId'
import useDebouncedChangeHandler from '../../hooks/useDebouncedChangeHandler'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
// import Dots from '../../components/Loader/Dots'
import { useBurnActionHandlers, useDerivedBurnSingleInfo, useBurnState } from '../../state/burn/hooks'

import { Field } from '../../state/burn/actions'
import { useExpertModeManager, useGasPrice, useUserSlippageTolerance } from '../../state/user/hooks'
import ConfirmSingleLiquidityModal from '../Swap/components/ConfirmRemoveSingleLiquidityModal'
import { logError } from '../../utils/sentry'
import Page from 'components/Layout/Page'
import Link from 'next/link'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'

// const BorderCard = styled.div`
//   border: solid 1px ${({ theme }) => theme.colors.cardBorder};
//   border-radius: 16px;
//   padding: 16px;
// `

// const CurrencySelectButton = styled(NormalButton).attrs({ variant: 'text', scale: 'sm' })`
//   padding: 0 0.5rem;
// `
/**
 * currencyA: tokenOut
 * currencyB: tokenIn
 * @returns
 */
export default function RemoveLiquidity() {
	const router = useRouter()
	const [currencyIdA, currencyIdB] = router.query.currency || []
	const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
	const { account, chainId, library } = useActiveWeb3React()
	const { isMobile } = useMatchBreakpoints()

	const [tokenA, tokenB] = useMemo(
		() => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
		[currencyA, currencyB, chainId],
	)

	// for expert mode
	const [isExpertMode] = useExpertModeManager()

	const {
		t,
		currentLanguage: { locale },
	} = useTranslation()
	const gasPrice = useGasPrice()

	// burn state
	const { independentField, typedValue } = useBurnState()
	const { pair, parsedAmounts, error, priceImpactSeverity, priceImpactWithoutFee } = useDerivedBurnSingleInfo(
		currencyA ?? undefined,
		currencyB ?? undefined,
	)

	const { onUserInput: _onUserInput } = useBurnActionHandlers()

	const isValid = !error

	// modal and loading
	const [showDetailed, setShowDetailed] = useState<boolean>(false)
	const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
		attemptingTxn: boolean
		liquidityErrorMessage: string | undefined
		txHash: string | undefined
	}>({
		attemptingTxn: false,
		liquidityErrorMessage: undefined,
		txHash: undefined,
	})

	// txn values
	const deadline = useTransactionDeadline()
	const [allowedSlippage] = useUserSlippageTolerance()

	const formattedAmounts = {
		[Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
			? '0'
			: parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
			? '<1'
			: parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
		[Field.LIQUIDITY]:
			independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
		[Field.CURRENCY_A]:
			independentField === Field.CURRENCY_A
				? typedValue
				: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
		[Field.CURRENCY_B]:
			independentField === Field.CURRENCY_B
				? typedValue
				: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
	}

	const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

	// pair contract
	const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

	// allowance handling
	const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(
		null,
	)
	const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ZAP_ADDRESS[CHAIN_ID])

	// check if user has gone through approval process, used to show two step buttons, reset on token change
	const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

	// mark when a user has submitted an approval, reset onTokenSelection for input field
	useEffect(() => {
		if (approval === ApprovalState.PENDING) {
			setApprovalSubmitted(true)
		}
	}, [approval, approvalSubmitted])

	// show approve flow when: no error on inputs, not approved or pending, or approved in current session
	// never show if price impact is above threshold in non expert mode
	const showApproveFlow =
		!error &&
		(approval === ApprovalState.NOT_APPROVED ||
			approval === ApprovalState.PENDING ||
			(approvalSubmitted && approval === ApprovalState.APPROVED)) &&
		!(priceImpactSeverity > 3 && !isExpertMode)

	// wrapped onUserInput to clear signatures
	const onUserInput = useCallback(
		(field: Field, value: string) => {
			setSignatureData(null)
			return _onUserInput(field, value)
		},
		[_onUserInput],
	)

	const onLiquidityInput = useCallback((value: string): void => onUserInput(Field.LIQUIDITY, value), [onUserInput])
	const onCurrencyAInput = useCallback((value: string): void => onUserInput(Field.CURRENCY_A, value), [onUserInput])

	// tx sending
	const addTransaction = useTransactionAdder()

	async function onRemove() {
		if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')
		const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts

		if (!currencyAmountA || !currencyAmountB) {
			withToast({ title: t('Error'), moreInfo: t('Missing currency amount') }, { type: 'error' })

			throw new Error('missing currency amounts')
		}

		const zapInContract = getZapInContract(chainId, library, account)

		if (!currencyA || !currencyB) {
			withToast({ title: t('Error'), moreInfo: t('Missing tokens') }, { type: 'error' })

			throw new Error('missing tokens')
		}
		const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
		if (!liquidityAmount) {
			withToast({ title: t('Error'), moreInfo: t('Missing liquidity amount') }, { type: 'error' })

			throw new Error('missing liquidity amount')
		}

		const currencyAIsETH = currencyA === ETHER

		if (!tokenA || !tokenB) {
			withToast({ title: t('Error'), moreInfo: t('Could not wrap') }, { type: 'error' })

			throw new Error('could not wrap')
		}

		let methodName: string
		let args: Array<string | string[] | number | boolean>
		// we have approval, use normal remove liquidity

		const minTokenOut = calculateSlippageAmount(currencyAmountA, allowedSlippage)[0].toString()

		if (currencyAIsETH) {
			methodName = 'zapOutEth'
			args = [
				tokenB.address,
				liquidityAmount.raw.toString(),
				pairContract.address,
				account,
				minTokenOut,
				deadline.toHexString(),
			]
		} else {
			methodName = 'zapOut'
			args = [
				tokenB.address,
				tokenA.address,
				liquidityAmount.raw.toString(),
				pairContract.address,
				account,
				minTokenOut,
				deadline.toHexString(),
			]
		}

		let estimateGasError = ''
		const safeGasEstimates = await Promise.all([
			zapInContract.estimateGas[methodName](...args)
				.then(calculateGasMargin)
				.catch(err => {
					estimateGasError = err?.data?.message
					console.error(`estimateGas failed`, methodName, args, err)
					return undefined
				}),
		])
		// )
		const indexOfSuccessfulEstimation = BigNumber.isBigNumber(safeGasEstimates[0])

		// all estimations failed...
		if (indexOfSuccessfulEstimation === false) {
			withToast(
				{ title: t('Error'), moreInfo: estimateGasError || t('This transaction would fail') },
				{ type: 'error' },
			)
		} else {
			const safeGasEstimate = safeGasEstimates[0]

			setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
			await zapInContract[methodName](...args, {
				gasLimit: safeGasEstimate,
				gasPrice,
			})
				.then((response: TransactionResponse) => {
					setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash })
					addTransaction(response, {
						summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
							currencyA?.symbol
						} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
					})
				})
				.catch(err => {
					if (err && err.code !== 4001) {
						logError(err)
						console.error(`Remove Liquidity failed`, err, args)
					}
					setLiquidityState({
						attemptingTxn: false,
						liquidityErrorMessage:
							err && err?.code !== 4001 ? `Remove Liquidity failed: ${err.message}` : undefined,
						txHash: undefined,
					})
				})
		}
	}

	const pendingText = t('Removing %amountA% %symbolA% and %amountB% %symbolB%', {
		amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
		symbolA: currencyA?.symbol ?? '',
		amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
		symbolB: currencyB?.symbol ?? '',
	})

	const liquidityPercentChangeCallback = useCallback(
		(value: number) => {
			onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
		},
		[onUserInput],
	)

	const oneCurrencyIsETH = currencyA === ETHER || currencyB === ETHER
	const oneCurrencyIsWETH = Boolean(
		chainId &&
			((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
				(currencyB && currencyEquals(WETH[chainId], currencyB))),
	)

	const handleSelectCurrencyA = useCallback(
		(currency: Currency) => {
			if (currencyIdB && currencyId(currency) === currencyIdB) {
				router.replace(`/remove-single/${currencyId(currency)}/${currencyIdA}`, undefined, { shallow: true })
			} else {
				router.replace(`/remove-single/${currencyId(currency)}/${currencyIdB}`, undefined, { shallow: true })
			}
		},
		[currencyIdA, currencyIdB, router],
	)

	const handleDismissConfirmation = useCallback(() => {
		setSignatureData(null) // important that we clear signature data to avoid bad sigs
		// if there was a tx hash, we want to clear the input
		if (txHash) {
			onUserInput(Field.LIQUIDITY_PERCENT, '0')
		}
	}, [onUserInput, txHash])

	const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
		Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
		liquidityPercentChangeCallback,
	)

	const [onPresentRemoveLiquidity] = useModal(
		<ConfirmSingleLiquidityModal
			title={t('You will receive')}
			customOnDismiss={handleDismissConfirmation}
			attemptingTxn={attemptingTxn}
			hash={txHash || ''}
			allowedSlippage={allowedSlippage}
			onRemove={onRemove}
			pendingText={pendingText}
			approval={approval}
			signatureData={signatureData}
			tokenA={tokenA}
			tokenB={tokenB}
			liquidityErrorMessage={liquidityErrorMessage}
			parsedAmounts={parsedAmounts}
			currencyA={currencyA}
			currencyB={currencyB}
		/>,
		true,
		true,
		'removeLiquidityModal',
	)

	return (
		<Page>
			<div className="flex col block-center">
				<AppBody className="border border-base radius-lg">
					<AppHeader
						backTo="/liquidity"
						title={
							isMobile
								? t('Remove liquidity')
								: t('Remove %assetA%-%assetB% liquidity', {
										assetA: currencyA?.symbol ?? '',
										assetB: currencyB?.symbol ?? '',
								  })
						}
						subtitle={t('To receive %assetA% and %assetB%', {
							assetA: currencyA?.symbol ?? '',
							assetB: currencyB?.symbol ?? '',
						})}
						// noConfig
					/>

					<div className="padding-md">
						<div className="flex col padding-xs">
							<Row className="flex-justify-space-between margin-bottom-lg">
								<div className="text margin-top-xl">{t('Amount')}</div>
								<NormalButton
									classes={{ other: 'text-bold text-base' }}
									variant="default"
									onClick={() => setShowDetailed(!showDetailed)}
								>
									{showDetailed ? t('Simple') : t('Detailed')}
								</NormalButton>
							</Row>
							{!showDetailed && (
								<div className="border border-base padding-md" style={{ borderRadius: '16' }}>
									<div className="text text-2xl text-bold margin-bottom-lg" style={{ lineHeight: 1 }}>
										{formattedAmounts[Field.LIQUIDITY_PERCENT]}%
									</div>
									<Slider
										name="lp-amount"
										min={0}
										max={100}
										value={innerLiquidityPercentage}
										onValueChanged={value => setInnerLiquidityPercentage(Math.ceil(value))}
									/>
									<div className="flex margin-top-lg flex-justify-space-between">
										<NormalButton
											variant="default"
											onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}
										>
											25%
										</NormalButton>
										<NormalButton
											variant="default"
											onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}
										>
											50%
										</NormalButton>
										<NormalButton
											variant="default"
											onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')}
										>
											75%
										</NormalButton>
										<NormalButton
											variant="default"
											onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
										>
											Max
										</NormalButton>
									</div>
								</div>
							)}
						</div>
						{!showDetailed && (
							<>
								<ColumnCenter>
									<Icon icon={IconEnum.ICON_DOWN} className="padding-md" />
								</ColumnCenter>
								<div className="flex col padding-xs">
									<span
										className="text text-sm text-bold text-uppercase margin-bottom-xs"
										color="secondary"
									>
										{t('You will receive')}
									</span>
									<div className="width-100 padding-md border border-base radius-lg">
										<div className="flex flex-justify-space-between">
											<div className="flex">
												<CurrencyLogo currency={currencyA} />
												<span
													className="text text-sm margin-left-2xs"
													color="textSubtle"
													id="remove-liquidity-tokena-symbol"
												>
													{currencyA?.symbol}
												</span>
											</div>
											<span className="text text-sm text-bold">
												{formattedAmounts[Field.CURRENCY_A] || '-'}
											</span>
										</div>

										{chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
											<Row
												className="flex-justify-space-between text"
												style={{ justifyContent: 'flex-end', fontSize: '14px' }}
											>
												{oneCurrencyIsETH ? (
													<Link
														href={`/remove/${
															currencyA === ETHER ? WETH[chainId].address : currencyIdA
														}/${currencyB === ETHER ? WETH[chainId].address : currencyIdB}`}
														passHref
													>
														<NormalButton
															variant="text"
															classes={{ color: 'secondary-color-normal' }}
														>
															{t('Receive WASA').toLocaleUpperCase(locale)}
														</NormalButton>
													</Link>
												) : oneCurrencyIsWETH ? (
													<Link
														href={`/remove/${
															currencyA && currencyEquals(currencyA, WETH[chainId])
																? 'BNB'
																: currencyIdA
														}/${
															currencyB && currencyEquals(currencyB, WETH[chainId])
																? 'BNB'
																: currencyIdB
														}`}
														passHref
													>
														<NormalButton
															variant="text"
															classes={{ color: 'secondary-color-normal' }}
														>
															{t('Receive WASA').toLocaleUpperCase(locale)}
														</NormalButton>
													</Link>
												) : null}
											</Row>
										) : null}
									</div>
								</div>
							</>
						)}

						{showDetailed && (
							<div>
								<CurrencyInputPanel
									value={formattedAmounts[Field.LIQUIDITY]}
									onUserInput={onLiquidityInput}
									onMax={() => {
										onUserInput(Field.LIQUIDITY_PERCENT, '100')
									}}
									showMaxButton={!atMaxAmount}
									disableCurrencySelect
									currency={pair?.liquidityToken}
									pair={pair}
									id="liquidity-amount"
									onCurrencySelect={() => null}
								/>
								<ColumnCenter>
									<Icon icon={IconEnum.ICON_DOWN} className="padding-md" />
								</ColumnCenter>
								<CurrencyInputPanel
									hideBalance
									value={formattedAmounts[Field.CURRENCY_A]}
									onUserInput={onCurrencyAInput}
									onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
									showMaxButton={!atMaxAmount}
									currency={currencyA}
									label={t('Output')}
									onCurrencySelect={handleSelectCurrencyA}
									id="remove-liquidity-tokena"
								/>
							</div>
						)}
						{pair && (
							<div className="flex col padding-xs margin-top-md" style={{ marginTop: '16px' }}>
								<span
									className="text text-sm text-bold text-uppercase margin-bottom-xs"
									color="secondary"
								>
									{t('Prices')}
								</span>
								<div className="width-100 padding-md border border-base radius-lg margin-bottom-md">
									<div className="flex flex-justify-space-between">
										<span className="text text-sm" color="textSubtle">
											1 {currencyA?.symbol} =
										</span>
										<span className="text text-sm text-bold">
											{tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
										</span>
									</div>
									<div className="flex flex-justify-space-between">
										<span className="text text-sm" color="textSubtle">
											1 {currencyB?.symbol} =
										</span>
										<span className="text text-sm text-bold">
											{tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
										</span>
									</div>
								</div>
							</div>
						)}
						{priceImpactWithoutFee && (
							<Row>
								<span className="text text-sm" style={{ marginRight: 5 }}>
									{t('Price Impact Without Fee')}:{' '}
								</span>
								<span className="text text-sm text-bold">{priceImpactWithoutFee.toFixed(3)}%</span>
							</Row>
						)}
						<div className="position-relative margin-top-xl">
							{!account ? (
								<ButtonConnect />
							) : showApproveFlow ? (
								<Row className="flex-justify-space-between">
									<NormalButton
										classes={{ other: 'width-100 text-base margin-right-sm' }}
										variant={
											approval === ApprovalState.APPROVED || signatureData !== null
												? 'primary'
												: 'default'
										}
										onClick={approveCallback}
										disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
									>
										{approval === ApprovalState.PENDING ? (
											<Row style={{ justifyContent: 'center' }}>
												{t('Enabling')} <CircleLoader stroke="white" />
											</Row>
										) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
											t('Enabled')
										) : (
											t('Enable')
										)}
									</NormalButton>
									<NormalButton
										classes={{ other: 'width-100 text-base' }}
										variant={
											!isValid &&
											!!parsedAmounts[Field.CURRENCY_A] &&
											!!parsedAmounts[Field.CURRENCY_B]
												? 'default'
												: 'primary'
										}
										onClick={() => {
											if (isExpertMode) {
												onRemove()
											} else {
												setLiquidityState({
													attemptingTxn: false,
													liquidityErrorMessage: undefined,
													txHash: undefined,
												})
												onPresentRemoveLiquidity()
											}
										}}
										disabled={
											!isValid ||
											approval !== ApprovalState.APPROVED ||
											(priceImpactSeverity > 3 && !isExpertMode)
										}
									>
										{error ||
											(priceImpactSeverity > 3 && !isExpertMode
												? t('Price Impact High')
												: priceImpactSeverity > 2
												? t('Remove Anyway')
												: t('Remove liquidity'))}
									</NormalButton>
								</Row>
							) : (
								<NormalButton
									classes={{ other: 'width-100 text-base' }}
									variant={
										!isValid &&
										!!parsedAmounts[Field.CURRENCY_A] &&
										!!parsedAmounts[Field.CURRENCY_B]
											? 'default'
											: 'primary'
									}
									onClick={() => {
										if (isExpertMode) {
											onRemove()
										} else {
											setLiquidityState({
												attemptingTxn: false,
												liquidityErrorMessage: undefined,
												txHash: undefined,
											})
											onPresentRemoveLiquidity()
										}
									}}
									disabled={
										!isValid ||
										approval !== ApprovalState.APPROVED ||
										(priceImpactSeverity > 3 && !isExpertMode)
									}
								>
									{error ||
										(priceImpactSeverity > 3 && !isExpertMode
											? t('Price Impact High')
											: priceImpactSeverity > 2
											? t('Remove Anyway')
											: t('Remove liquidity'))}
								</NormalButton>
							)}
						</div>
					</div>
				</AppBody>

				{pair ? <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} /> : null}
			</div>
		</Page>
	)
}
