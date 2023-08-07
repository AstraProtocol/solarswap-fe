// TODO PCS refactor ternaries
/* eslint-disable no-nested-ternary */
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { formatDistanceToNowStrict } from 'date-fns'
import { vi, enUS } from 'date-fns/locale'
import { Fragment, HtmlHTMLAttributes, cloneElement, useCallback, useEffect, useMemo, useState } from 'react'
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
import { Icon, IconEnum, RadioButton, Row, Typography } from '@astraprotocol/astra-ui'
import truncateHash from 'utils/truncateHash'
import { useDomainNameForAddress } from 'hooks/useDomain'

const ResponsiveGrid = ({ children }) => (
	<div className={style.transactionsTableResponsiveGrid}>
		{isArray(children) ? children.map((c, index) => cloneElement(c, { key: index })) : children}
	</div>
)

const RadioGroup = (props: HtmlHTMLAttributes<HTMLDivElement>) => (
	<div className={style.transactionsTableRadioGroup} {...props}>
		{isArray(props.children) ? props.children.map((c, index) => cloneElement(c, { key: index })) : props.children}
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
	const { t, currentLanguage } = useTranslation()
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
			<Typography.Link target="_blank" href={getAstraExplorerLink(transaction.hash, 'transaction')}>
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
			</Typography.Link>
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
				{formatDistanceToNowStrict(parseInt(transaction.timestamp, 10) * 1000, {
					locale: currentLanguage.code === 'vi' ? vi : enUS,
				})}
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
		<div className="flex col width-100">
			<Row className="margin-bottom-md">
				<Row>
					<RadioGroup onClick={() => handleFilter(undefined)}>
						<RadioButton onClick={() => null} checked={txFilter === undefined} text={''} value={''} />
						<span className="text text-base margin-left-xs">{t('All')}</span>
					</RadioGroup>

					<RadioGroup onClick={() => handleFilter(TransactionType.SWAP)}>
						<RadioButton
							onClick={() => null}
							checked={txFilter === TransactionType.SWAP}
							text={''}
							value={''}
						/>
						<span className="text text-base margin-left-xs">{t('Swaps')}</span>
					</RadioGroup>
					<RadioGroup onClick={() => handleFilter(TransactionType.MINT)}>
						<RadioButton
							onClick={() => null}
							checked={txFilter === TransactionType.MINT}
							text={''}
							value={''}
						/>
						<span className="text text-base margin-left-xs">{t('Adds')}</span>
					</RadioGroup>

					<RadioGroup onClick={() => handleFilter(TransactionType.BURN)}>
						<RadioButton
							onClick={() => null}
							checked={txFilter === TransactionType.BURN}
							text={''}
							value={''}
						/>
						<span className="text text-base margin-left-xs">{t('Removes')}</span>
					</RadioGroup>
				</Row>
			</Row>
			<TableWrapper>
				<ResponsiveGrid>
					<span className="text text-xs text-bold text-uppercase secondary-color-normal">
						{t('Action')}
					</span>
					<ClickableColumnHeader
						className="text text-bold text-xs secondary-color-normal text-uppercase"
						onClick={() => handleSort(SORT_FIELD.amountUSD)}
					>
						{t('Total Value')} {arrow(SORT_FIELD.amountUSD)}
					</ClickableColumnHeader>
					<ClickableColumnHeader
						className="text text-bold text-xs secondary-color-normal text-uppercase"
						onClick={() => handleSort(SORT_FIELD.amountToken0)}
					>
						{t('Token Amount')} {arrow(SORT_FIELD.amountToken0)}
					</ClickableColumnHeader>
					<ClickableColumnHeader
						className="text text-bold text-xs secondary-color-normal text-uppercase"
						onClick={() => handleSort(SORT_FIELD.amountToken1)}
					>
						{t('Token Amount')} {arrow(SORT_FIELD.amountToken1)}
					</ClickableColumnHeader>
					<ClickableColumnHeader
						className="text text-bold text-xs secondary-color-normal text-uppercase"
						onClick={() => handleSort(SORT_FIELD.sender)}
					>
						{t('Account')} {arrow(SORT_FIELD.sender)}
					</ClickableColumnHeader>
					<ClickableColumnHeader
						className="text text-bold text-xs secondary-color-normal text-uppercase"
						onClick={() => handleSort(SORT_FIELD.timestamp)}
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
