import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { Fragment, cloneElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useStableSwapPath } from 'state/info/hooks'
import { PoolData } from 'state/info/types'
import { formatAmount } from 'utils/formatInfoNumbers'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from './shared'
import Skeleton from 'react-loading-skeleton'
import { useTranslation } from 'contexts/Localization'
import styles from './styles.module.scss'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { DoubleCurrencyLogo } from 'components/Logo'
import { Icon, IconEnum, Row } from '@astraprotocol/astra-ui'
import { isArray } from 'lodash'
import { Token } from '@solarswap/sdk'
import { CHAIN_ID } from 'config/constants/networks'

/**
 *  Columns on different layouts
 *  5 = | # | Pool | TVL | Volume 24H | Volume 7D |
 *  4 = | # | Pool |     | Volume 24H | Volume 7D |
 *  3 = | # | Pool |     | Volume 24H |           |
 *  2 = |   | Pool |     | Volume 24H |           |
 */
const ResponsiveGrid = ({ children }) => {
	if (isArray(children))
		return (
			<div className={styles.responsiveGrid}>{children.map((c, index) => cloneElement(c, { key: index }))}</div>
		)
	return <div className={styles.responsiveGrid}>{children}</div>
}
const LinkWrapper = ({ children, to }) => {
	return (
		<NextLinkFromReactRouter to={to} className={styles.linkWrapper}>
			{isArray(children) ? children.map((c, index) => cloneElement(c, { key: index })) : children}
		</NextLinkFromReactRouter>
	)
}

const SORT_FIELD = {
	volumeUSD: 'volumeUSD',
	liquidityUSD: 'liquidityUSD',
	volumeUSDWeek: 'volumeUSDWeek',
	lpFees24h: 'lpFees24h',
	lpApr7d: 'lpApr7d',
}

const LoadingRow: React.FC<React.PropsWithChildren> = () => (
	<div>
		<Skeleton />
		<Skeleton />
		<Skeleton />
		<Skeleton />
		<Skeleton />
		<Skeleton />
		<Skeleton />
	</div>
)

const TableLoader: React.FC<React.PropsWithChildren> = () => (
	<>
		<LoadingRow />
		<LoadingRow />
		<LoadingRow />
	</>
)

const DataRow = ({ poolData, index }: { poolData: PoolData; index: number }) => {
	const stableSwapPath = useStableSwapPath()

	const token0 = new Token(parseInt(CHAIN_ID), poolData.token0.address, 18, '')
	const token1 = new Token(parseInt(CHAIN_ID), poolData.token1.address, 18, '')

	return (
		<LinkWrapper to={`/info/pairs/${poolData.address}${stableSwapPath}`}>
			<ResponsiveGrid>
				<span className="text text-base">{index + 1}</span>
				<Row>
					<DoubleCurrencyLogo currency0={token0} currency1={token1} />
					<span className="margin-left-xs">
						{poolData.token0.symbol}/{poolData.token1.symbol}
					</span>
				</Row>
				<span className="money money-sm">${formatAmount(poolData.volumeUSD)}</span>
				<span className="money money-sm">${formatAmount(poolData.volumeUSDWeek)}</span>
				<span className="money money-sm">${formatAmount(poolData.lpFees24h)}</span>
				<span className="money money-sm">{formatAmount(poolData.lpApr7d)}%</span>
				<span className="money money-sm">${formatAmount(poolData.liquidityUSD)}</span>
			</ResponsiveGrid>
		</LinkWrapper>
	)
}

interface PoolTableProps {
	poolDatas: PoolData[]
	loading?: boolean // If true shows indication that SOME pools are loading, but the ones already fetched will be shown
}

const PoolTable: React.FC<React.PropsWithChildren<PoolTableProps>> = ({ poolDatas, loading }) => {
	// for sorting
	const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
	const [sortDirection, setSortDirection] = useState<boolean>(true)
	const { t } = useTranslation()

	// pagination
	const [page, setPage] = useState(1)
	const [maxPage, setMaxPage] = useState(1)
	useEffect(() => {
		let extraPages = 1
		if (poolDatas.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
			extraPages = 0
		}
		setMaxPage(Math.floor(poolDatas.length / ITEMS_PER_INFO_TABLE_PAGE) + extraPages)
	}, [poolDatas])
	const sortedPools = useMemo(() => {
		return poolDatas
			? poolDatas
					.sort((a, b) => {
						if (a && b) {
							return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
								? (sortDirection ? -1 : 1) * 1
								: (sortDirection ? -1 : 1) * -1
						}
						return -1
					})
					.slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
			: []
	}, [page, poolDatas, sortDirection, sortField])

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
		<TableWrapper>
			<ResponsiveGrid>
				<span color="secondary" className="text text-sm text-bold secondary-color-normal">
					#
				</span>
				<span color="secondary" className="text text-sm text-bold secondary-color-normal text-uppercase">
					{t('Pair')}
				</span>
				<ClickableColumnHeader
					color="secondary"
					fontSize="12px"
					bold
					onClick={() => handleSort(SORT_FIELD.volumeUSD)}
					textTransform="uppercase"
				>
					{t('Volume 24H')} {arrow(SORT_FIELD.volumeUSD)}
				</ClickableColumnHeader>
				<ClickableColumnHeader
					color="secondary"
					fontSize="12px"
					bold
					onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
					textTransform="uppercase"
				>
					{t('Volume 7D')} {arrow(SORT_FIELD.volumeUSDWeek)}
				</ClickableColumnHeader>
				<ClickableColumnHeader
					color="secondary"
					fontSize="12px"
					bold
					onClick={() => handleSort(SORT_FIELD.lpFees24h)}
					textTransform="uppercase"
				>
					{t('LP reward fees 24H')} {arrow(SORT_FIELD.lpFees24h)}
				</ClickableColumnHeader>
				<ClickableColumnHeader
					color="secondary"
					fontSize="12px"
					bold
					onClick={() => handleSort(SORT_FIELD.lpApr7d)}
					textTransform="uppercase"
				>
					{t('LP reward APR')} {arrow(SORT_FIELD.lpApr7d)}
				</ClickableColumnHeader>
				<ClickableColumnHeader
					color="secondary"
					fontSize="12px"
					bold
					onClick={() => handleSort(SORT_FIELD.liquidityUSD)}
					textTransform="uppercase"
				>
					{t('Liquidity')} {arrow(SORT_FIELD.liquidityUSD)}
				</ClickableColumnHeader>
			</ResponsiveGrid>
			<Break />
			{sortedPools.length > 0 ? (
				<>
					{sortedPools.map((poolData, i) => {
						if (poolData) {
							return (
								<Fragment key={poolData.address}>
									<DataRow index={(page - 1) * ITEMS_PER_INFO_TABLE_PAGE + i} poolData={poolData} />
									<Break />
								</Fragment>
							)
						}
						return null
					})}
					{loading && <LoadingRow />}
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
	)
}

export default PoolTable
