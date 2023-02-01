import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'contexts/Localization'
import orderBy from 'lodash/orderBy'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { AppDispatch } from 'state'
import { clearAllTransactions } from 'state/transactions/actions'

import Transaction from './Transaction'
import { InjectedModalProps, Modal } from 'components/Modal'
import { NormalButton, Row } from '@astraprotocol/astra-ui'
import ButtonConnect from '../../ButtonConnect'

function renderTransactions(transactions: TransactionDetails[]) {
	return (
		<div className="flex col ">
			{transactions.map(tx => {
				return <Transaction key={tx.hash + tx.addedTime} tx={tx} />
			})}
		</div>
	)
}

const TransactionsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
	const { account, chainId } = useActiveWeb3React()
	const dispatch = useDispatch<AppDispatch>()
	const allTransactions = useAllTransactions()

	const { t } = useTranslation()

	const sortedRecentTransactions = orderBy(
		Object.values(allTransactions).filter(isTransactionRecent),
		'addedTime',
		'desc',
	)

	const pending = sortedRecentTransactions.filter(tx => !tx.receipt)
	const confirmed = sortedRecentTransactions.filter(tx => tx.receipt)

	const clearAllTransactionsCallback = useCallback(() => {
		if (chainId) dispatch(clearAllTransactions({ chainId }))
	}, [dispatch, chainId])

	return (
		<Modal title={t('Recent Transactions')} onDismiss={onDismiss}>
			{account ? (
				<div>
					{!!pending.length || !!confirmed.length ? (
						<>
							<Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
								<span className="text text-base">{t('Recent Transactions')}</span>
								<NormalButton
									variant="text"
									classes={{ color: 'secondary-color-normal', other: 'text-base' }}
									onClick={clearAllTransactionsCallback}
								>
									{t('clear all')}
								</NormalButton>
							</Row>
							{renderTransactions(pending)}
							{renderTransactions(confirmed)}
						</>
					) : (
						<span className="text text-base">{t('No recent transactions')}</span>
					)}
				</div>
			) : (
				<ButtonConnect />
			)}
		</Modal>
	)
}

export default TransactionsModal
