import { useCallback, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'

import { logError, isUserRejected } from 'utils/sentry'
import ToastDescriptionWithTx from 'components/ToastDescriptionWithTx'
import { withToast } from '@astraprotocol/astra-ui'

export type TxResponse = TransactionResponse | null

export type CatchTxErrorReturn = {
	fetchWithCatchTxError: (fn: () => Promise<TxResponse>) => Promise<TransactionReceipt>
	loading: boolean
}

type ErrorData = {
	code: number
	message: string
}

type TxError = {
	data: ErrorData
	error: string
}

// -32000 is insufficient funds for gas * price + value
const isGasEstimationError = (err: TxError): boolean => err?.data?.code === -32000

export default function useCatchTxError(): CatchTxErrorReturn {
	const { library } = useWeb3React()
	const { t } = useTranslation()
	// const { toastError, toastSuccess } = useToast()
	const [loading, setLoading] = useState(false)

	const handleNormalError = useCallback(
		(error, tx?: TxResponse) => {
			logError(error)
			let err
			if (tx) {
				err = (
					<ToastDescriptionWithTx txHash={tx.hash}>
						{t('Please try again. Confirm the transaction and make sure you are paying enough gas!')}
					</ToastDescriptionWithTx>
				)
			} else {
				err = t('Please try again. Confirm the transaction and make sure you are paying enough gas!')
			}
			withToast(
				{
					title: t('Error'),
					moreInfo: err,
				},
				{ type: 'error' },
			)
		},
		[t],
	)

	const fetchWithCatchTxError = useCallback(
		async (callTx: () => Promise<TxResponse>): Promise<TransactionReceipt | null> => {
			let tx: TxResponse = null

			try {
				setLoading(true)

				/**
				 * https://github.com/vercel/swr/pull/1450
				 *
				 * wait for useSWRMutation finished, so we could apply SWR in case manually trigger tx call
				 */
				tx = await callTx()

				withToast(
					{
						title: t('Transaction Submitted'),
						moreInfo: <ToastDescriptionWithTx txHash={tx.hash} />,
					},
					{ type: 'success' },
				)

				const receipt = await tx.wait()

				return receipt
			} catch (error: any) {
				if (!isUserRejected(error)) {
					if (!tx) {
						handleNormalError(error)
					} else {
						library
							.call(tx, tx.blockNumber)
							.then(() => {
								handleNormalError(error, tx)
							})
							.catch((err: any) => {
								if (isGasEstimationError(err)) {
									handleNormalError(error, tx)
								} else {
									logError(err)

									let recursiveErr = err

									let reason: string | undefined

									// for MetaMask
									if (recursiveErr?.data?.message) {
										reason = recursiveErr?.data?.message
									} else {
										// for other wallets
										// Reference
										// https://github.com/Uniswap/interface/blob/ac962fb00d457bc2c4f59432d7d6d7741443dfea/src/hooks/useSwapCallback.tsx#L216-L222
										while (recursiveErr) {
											reason = recursiveErr.reason ?? recursiveErr.message ?? reason
											recursiveErr = recursiveErr.error ?? recursiveErr.data?.originalError
										}
									}

									const REVERT_STR = 'execution reverted: '
									const indexInfo = reason?.indexOf(REVERT_STR)
									const isRevertedError = indexInfo >= 0

									if (isRevertedError) reason = reason.substring(indexInfo + REVERT_STR.length)

									withToast(
										{
											title: t('Failed'),
											moreInfo: (
												<ToastDescriptionWithTx txHash={tx.hash}>
													{isRevertedError
														? `Transaction failed with error: ${reason}`
														: 'Transaction failed. For detailed error message:'}
												</ToastDescriptionWithTx>
											),
										},
										{ type: 'error' },
									)
								}
							})
					}
				}
			} finally {
				setLoading(false)
			}

			return null
		},
		[handleNormalError, library, t],
	)

	return {
		fetchWithCatchTxError,
		loading,
	}
}
