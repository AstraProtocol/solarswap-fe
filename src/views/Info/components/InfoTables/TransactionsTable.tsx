// TODO PCS refactor ternaries
/* eslint-disable no-nested-ternary */
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { formatDistanceToNowStrict } from 'date-fns'
import { Fragment, cloneElement, useCallback, useEffect, useMemo, useState } from 'react'
// import { useChainNameByQuery } from 'state/info/hooks'
import { Transaction, TransactionType } from 'state/info/types'
import { getAstraExplorerLink } from 'utils'
import { subgraphTokenSymbol } from 'state/info/constant'

import { formatAmount } from 'utils/formatInfoNumbers'
// import { useDomainNameForAddress } from 'hooks/useDomain'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from './shared'
import { useTranslation } from 'contexts/Localization'
import style from './styles.module.scss'
import { isArray } from 'lodash'
import Skeleton from 'react-loading-skeleton'
import { Icon, IconEnum, Typography } from '@astraprotocol/astra-ui'
import truncateHash from 'utils/truncateHash'
import { useDomainNameForAddress } from 'hooks/useDomain'

const ResponsiveGrid = ({ children }) => (
	<div className={style.transactionsTableResponsiveGrid}>
		{isArray(children) ? children.map((c, index) => cloneElement(c, { key: index })) : children}
	</div>
)

const RadioGroup = ({ children }) => (
	<div className={style.transactionsTableRadioGroup}>
		{isArray(children) ? children.map((c, index) => cloneElement(c, { key: index })) : children}
	</div>
)

const SORT_FIELD = {
	amountUSD: 'amountUSD',
	timestamp: 'timestamp',
	sender: 'sender',
	amountToken0: 'amountToken0',
	amountToken1: 'amountToken1',
}

const TableLoader: React.FC<React.PropsWithChildren> = () => {
	const loadingRow = (
		<ResponsiveGrid>
			<Skeleton />
			<Skeleton />
			<Skeleton />
			<Skeleton />
			<Skeleton />
			<Skeleton />
		</ResponsiveGrid>
	)
	return (
		<>
			{loadingRow}
			{loadingRow}
			{loadingRow}
		</>
	)
}

const DataRow: React.FC<React.PropsWithChildren<{ transaction: Transaction }>> = ({ transaction }) => {
	const { t } = useTranslation()
	const abs0 = Math.abs(transaction.amountToken0)
	const abs1 = Math.abs(transaction.amountToken1)
	// const chainName = useChainNameByQuery()
	const { domainName } = useDomainNameForAddress(transaction.sender)
	const token0Symbol = subgraphTokenSymbol[transaction.token0Address.toLowerCase()] ?? transaction.token0Symbol
	const token1Symbol = subgraphTokenSymbol[transaction.token1Address.toLowerCase()] ?? transaction.token1Symbol
	const outputTokenSymbol = transaction.amountToken0 < 0 ? token0Symbol : token1Symbol
	const inputTokenSymbol = transaction.amountToken1 < 0 ? token0Symbol : token1Symbol

	return (
		<ResponsiveGrid>
			{/* <ScanLink
	      chainId={multiChainId[chainName]}
	      href={getAstraExplorerLink(transaction.hash, 'transaction', multiChainId[chainName])}
	    >
	      <Text>
	        {transaction.type === TransactionType.MINT
	          ? t('Add %token0% and %token1%', {
	              token0: token0Symbol,
	              token1: token1Symbol,
	            })
	          : transaction.type === TransactionType.SWAP
	          ? t('Swap %token0% for %token1%', {
	              token0: inputTokenSymbol,
	              token1: outputTokenSymbol,
	            })
	          : t('Remove %token0% and %token1%', {
	              token0: token0Symbol,
	              token1: token1Symbol,
	            })}
	      </Text>
	    </ScanLink> */}
			<span className="text text-base">${formatAmount(transaction.amountUSD)}</span>
			<span className="text text-base">
				<span>{`${formatAmount(abs0)} ${transaction.token0Symbol}`}</span>
			</span>
			<span className="text text-base">
				<span>{`${formatAmount(abs1)} ${transaction.token1Symbol}`}</span>
			</span>
			<Typography.Link target="_blank" href={getAstraExplorerLink(transaction.sender, 'address')}>
				{domainName || truncateHash(transaction.sender)}
			</Typography.Link>

			<span className="text text-base">
				{formatDistanceToNowStrict(parseInt(transaction.timestamp, 10) * 1000)}
			</span>
		</ResponsiveGrid>
	)
}

const TransactionTable: React.FC<
	React.PropsWithChildren<{
		transactions: Transaction[]
	}>
> = ({ transactions }) => {
	const [sortField, setSortField] = useState(SORT_FIELD.timestamp)
	const [sortDirection, setSortDirection] = useState<boolean>(true)

	const { t } = useTranslation()

	const [page, setPage] = useState(1)
	const [maxPage, setMaxPage] = useState(1)

	const [txFilter, setTxFilter] = useState<TransactionType | undefined>(undefined)

	const sortedTransactions = useMemo(() => {
		const toBeAbsList = [SORT_FIELD.amountToken0, SORT_FIELD.amountToken1]
		return transactions
			? [...transactions]
					.sort((a, b) => {
						if (a && b) {
							const firstField = a[sortField as keyof Transaction]
							const secondField = b[sortField as keyof Transaction]
							const [first, second] = toBeAbsList.includes(sortField)
								? [Math.abs(firstField as number), Math.abs(secondField as number)]
								: [firstField, secondField]
							return first > second ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
						}
						return -1
					})
					.filter(x => {
						return txFilter === undefined || x.type === txFilter
					})
					.slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
			: []
	}, [transactions, page, sortField, sortDirection, txFilter])

	// Update maxPage based on amount of items & applied filtering
	useEffect(() => {
		if (transactions) {
			const filteredTransactions = transactions.filter(tx => {
				return txFilter === undefined || tx.type === txFilter
			})
			if (filteredTransactions.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
				setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_INFO_TABLE_PAGE))
			} else {
				setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_INFO_TABLE_PAGE) + 1)
			}
		}
	}, [transactions, txFilter])

	const handleFilter = useCallback(
		(newFilter: TransactionType) => {
			if (newFilter !== txFilter) {
				setTxFilter(newFilter)
				setPage(1)
			}
		},
		[txFilter],
	)

	const handleSort = useCallback(
		(newField: string) => {
			setSortField(newField)
			setSortDirection(sortField !== newField ? true : !sortDirection)
		},
		[sortDirection, sortField],
	)

	const arrow = useCallback(
		(field: string) => {
			const directionArrow = !sortDirection ? '↑' : '↓'
			return sortField === field ? directionArrow : ''
		},
		[sortDirection, sortField],
	)
	return (
		<div className="flex width-100">
			{/* <div className='margin-bottom-md'>
				<div>
					<RadioButton onClick={() => handleFilter(undefined)}>
						<Radio onChange={() => null} scale="sm" checked={txFilter === undefined} />
						<Text ml="8px">{t('All')}</Text>
					</RadioGroup>

					<RadioGroup onClick={() => handleFilter(TransactionType.SWAP)}>
						<Radio onChange={() => null} scale="sm" checked={txFilter === TransactionType.SWAP} />
						<Text ml="8px">{t('Swaps')}</Text>
					</RadioGroup>
				</div>

				<div flexDirection={['column', 'row']}>
					<RadioGroup onClick={() => handleFilter(TransactionType.MINT)}>
						<Radio onChange={() => null} scale="sm" checked={txFilter === TransactionType.MINT} />
						<Text ml="8px">{t('Adds')}</Text>
					</RadioGroup>

					<RadioGroup onClick={() => handleFilter(TransactionType.BURN)}>
						<Radio onChange={() => null} scale="sm" checked={txFilter === TransactionType.BURN} />
						<Text ml="8px">{t('Removes')}</Text>
					</RadioGroup>
				</div>
			</div> */}
			<TableWrapper>
				<ResponsiveGrid>
					<span className="text text-xs text-bold text-uppercase secondary-color-normal">{t('Action')}</span>
					<ClickableColumnHeader
						color="secondary"
						fontSize="12px"
						bold
						onClick={() => handleSort(SORT_FIELD.amountUSD)}
						textTransform="uppercase"
					>
						{t('Total Value')} {arrow(SORT_FIELD.amountUSD)}
					</ClickableColumnHeader>
					<ClickableColumnHeader
						color="secondary"
						fontSize="12px"
						bold
						onClick={() => handleSort(SORT_FIELD.amountToken0)}
						textTransform="uppercase"
					>
						{t('Token Amount')} {arrow(SORT_FIELD.amountToken0)}
					</ClickableColumnHeader>
					<ClickableColumnHeader
						color="secondary"
						fontSize="12px"
						bold
						onClick={() => handleSort(SORT_FIELD.amountToken1)}
						textTransform="uppercase"
					>
						{t('Token Amount')} {arrow(SORT_FIELD.amountToken1)}
					</ClickableColumnHeader>
					<ClickableColumnHeader
						color="secondary"
						fontSize="12px"
						bold
						onClick={() => handleSort(SORT_FIELD.sender)}
						textTransform="uppercase"
					>
						{t('Account')} {arrow(SORT_FIELD.sender)}
					</ClickableColumnHeader>
					<ClickableColumnHeader
						color="secondary"
						fontSize="12px"
						bold
						onClick={() => handleSort(SORT_FIELD.timestamp)}
						textTransform="uppercase"
					>
						{t('Time')} {arrow(SORT_FIELD.timestamp)}
					</ClickableColumnHeader>
				</ResponsiveGrid>
				<Break />

				{transactions ? (
					<>
						{sortedTransactions.map((transaction, index) => {
							if (transaction) {
								return (
									// eslint-disable-next-line react/no-array-index-key
									<Fragment key={index}>
										<DataRow transaction={transaction} />
										<Break />
									</Fragment>
								)
							}
							return null
						})}
						{sortedTransactions.length === 0 ? (
							<div>
								<span className="text text-base">{t('No Transactions')}</span>
							</div>
						) : undefined}
						<PageButtons>
							<Arrow
								onClick={() => {
									setPage(page === 1 ? page : page - 1)
								}}
							>
								<Icon icon={IconEnum.ICON_ARROW_LEFT} color={page === 1 ? 'textDisabled' : 'primary'} />
							</Arrow>

							<span className="text text-base">{t('Page %page% of %maxPage%', { page, maxPage })}</span>
							<Arrow
								onClick={() => {
									setPage(page === maxPage ? page : page + 1)
								}}
							>
								<Icon
									icon={IconEnum.ICON_ARROW_RIGHT}
									color={page === maxPage ? 'textDisabled' : 'primary'}
								/>
							</Arrow>
						</PageButtons>
					</>
				) : (
					<>
						<TableLoader />
						{/* spacer */}
						<div />
					</>
				)}
			</TableWrapper>
		</div>
	)
}

export default TransactionTable
