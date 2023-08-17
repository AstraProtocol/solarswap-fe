import { useState, useMemo, useCallback, useEffect, Fragment, cloneElement } from 'react'
import { useStableSwapPath } from 'state/info/hooks'
import { subgraphTokenName, subgraphTokenSymbol } from 'state/info/constant'
import { TokenData } from 'state/info/types'
import Percent from 'views/Info/components/Percent'
import orderBy from 'lodash/orderBy'
import { formatAmount } from 'utils/formatInfoNumbers'
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from './shared'
import Skeleton from 'react-loading-skeleton'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import { useTranslation } from 'contexts/Localization'
import styles from './styles.module.scss'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { CurrencyLogo } from 'components/Logo'
import { Icon, IconEnum, Row } from '@astraprotocol/astra-ui'
import { isArray } from 'lodash'
import { Token } from '@solarswap/sdk'
import { CHAIN_ID } from 'config/constants/networks'

/**
 *  Columns on different layouts
 *  6 = | # | Name | Price | Price Change | Volume 24H | TVL |
 *  5 = | # | Name | Price |              | Volume 24H | TVL |
 *  4 = | # | Name | Price |              | Volume 24H |     |
 *  2 = |   | Name |       |              | Volume 24H |     |
 *  On smallest screen Name is reduced to just symbol
 */
const ResponsiveGrid = ({ children }) => {
	if (isArray(children))
		return (
			<div className={styles.tokensTableResponsiveGrid}>
				{children.map((child, index) => cloneElement(child, { key: index }))}
			</div>
		)
	return <div className={styles.tokensTableResponsiveGrid}>{children}</div>
}

const LinkWrapper = ({ children, ...props }) => (
	<NextLinkFromReactRouter {...props} to={props.to} className={styles.linkWrapper}>
		{isArray(children) ? children.map((c, index) => cloneElement(c, { key: index })) : children}
	</NextLinkFromReactRouter>
)

const ResponsiveLogo = ({ ...props }) => <CurrencyLogo {...props} />

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

const DataRow: React.FC<React.PropsWithChildren<{ tokenData: TokenData; index: number }>> = ({ tokenData, index }) => {
	const { isXs, isSm } = useMatchBreakpoints()
	const stableSwapPath = useStableSwapPath()
	const token = new Token(parseInt(CHAIN_ID), tokenData.address, 18, '')
	return (
		<LinkWrapper to={`/info/tokens/${tokenData.address}${stableSwapPath}`}>
			<ResponsiveGrid>
				<span className="text text-base">{index + 1}</span>
				<Row>
					<ResponsiveLogo size={24} currency={token} />
					{(isXs || isSm) && <span className="margin-left-xs text text-base">{tokenData.symbol}</span>}
					{!isXs && !isSm && (
						<div className="margin-left-xs">
							<span className="text text-base">
								{subgraphTokenName[tokenData.address] ?? tokenData.name}
							</span>
							<span className="margin-left-xs text text-base">
								({subgraphTokenSymbol[tokenData.address] ?? tokenData.symbol})
							</span>
						</div>
					)}
				</Row>
				<span className="text text-base">${formatAmount(tokenData.priceUSD, { notation: 'standard' })}</span>
				<span className="text text-base">
					<Percent value={tokenData.priceUSDChange} className="text text-base" />
				</span>
				<span className="text text-base">${formatAmount(tokenData.volumeUSD)}</span>
				<span className="text text-base">${formatAmount(tokenData.liquidityUSD)}</span>
			</ResponsiveGrid>
		</LinkWrapper>
	)
}

const SORT_FIELD = {
	name: 'name',
	volumeUSD: 'volumeUSD',
	liquidityUSD: 'liquidityUSD',
	priceUSD: 'priceUSD',
	priceUSDChange: 'priceUSDChange',
	priceUSDChangeWeek: 'priceUSDChangeWeek',
}

const MAX_ITEMS = 10

const TokenTable: React.FC<
	React.PropsWithChildren<{
		tokenDatas: TokenData[] | undefined
		maxItems?: number
	}>
> = ({ tokenDatas, maxItems = MAX_ITEMS }) => {
	const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
	const [sortDirection, setSortDirection] = useState<boolean>(true)
	const { t } = useTranslation()

	const [page, setPage] = useState(1)
	const [maxPage, setMaxPage] = useState(1)
	useEffect(() => {
		let extraPages = 1
		if (tokenDatas) {
			if (tokenDatas.length % maxItems === 0) {
				extraPages = 0
			}
			setMaxPage(Math.floor(tokenDatas.length / maxItems) + extraPages)
		}
	}, [maxItems, tokenDatas])

	const sortedTokens = useMemo(() => {
		return tokenDatas
			? orderBy(
					tokenDatas,
					tokenData => tokenData[sortField as keyof TokenData],
					sortDirection ? 'desc' : 'asc',
			  ).slice(maxItems * (page - 1), page * maxItems)
			: []
	}, [tokenDatas, maxItems, page, sortDirection, sortField])

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

	if (!tokenDatas) {
		return <Skeleton />
	}

	return (
		<TableWrapper>
			<ResponsiveGrid>
				<span className="text text-xs secondary-color-normal text-bold">#</span>
				<ClickableColumnHeader
					className="text-xs text-bold text-uppercase secondary-color-normal"
					onClick={() => handleSort(SORT_FIELD.name)}
				>
					{t('Name')} {arrow(SORT_FIELD.name)}
				</ClickableColumnHeader>
				<ClickableColumnHeader
					className="text-xs text-bold text-uppercase secondary-color-normal"
					onClick={() => handleSort(SORT_FIELD.priceUSD)}
				>
					{t('Price')} {arrow(SORT_FIELD.priceUSD)}
				</ClickableColumnHeader>
				<ClickableColumnHeader
					className="text-xs text-bold text-uppercase secondary-color-normal"
					onClick={() => handleSort(SORT_FIELD.priceUSDChange)}
				>
					{t('Price Change')} {arrow(SORT_FIELD.priceUSDChange)}
				</ClickableColumnHeader>
				<ClickableColumnHeader
					className="text-xs text-bold text-uppercase secondary-color-normal"
					onClick={() => handleSort(SORT_FIELD.volumeUSD)}
				>
					{t('Volume 24H')} {arrow(SORT_FIELD.volumeUSD)}
				</ClickableColumnHeader>
				<ClickableColumnHeader
					className="text-xs text-bold text-uppercase secondary-color-normal"
					onClick={() => handleSort(SORT_FIELD.liquidityUSD)}
				>
					{t('Liquidity')} {arrow(SORT_FIELD.liquidityUSD)}
				</ClickableColumnHeader>
			</ResponsiveGrid>

			<Break />
			{sortedTokens.length > 0 ? (
				<>
					{sortedTokens.map((data, i) => {
						if (data) {
							return (
								<Fragment key={data.address}>
									<DataRow index={(page - 1) * MAX_ITEMS + i} tokenData={data} />
									<Break />
								</Fragment>
							)
						}
						return null
					})}
					<PageButtons>
						{maxPage > 1 && page > 1 && (
							<Arrow
								onClick={() => {
									setPage(page === 1 ? page : page - 1)
								}}
							>
								<Icon icon={IconEnum.ICON_ARROW_LEFT} color={page === 1 ? 'textDisabled' : 'primary'} />
							</Arrow>
						)}
						<span className="text text-base">{t('Page %page% of %maxPage%', { page, maxPage })}</span>
						{maxPage > 1 && page < maxPage && (
							<Arrow
								onClick={() => {
									setPage(page === maxPage ? page : page + 1)
								}}
							>
								<Icon
									icon={IconEnum.ICON_ARROW_RIGHT}
									color={page === 1 ? 'textDisabled' : 'primary'}
								/>
							</Arrow>
						)}
					</PageButtons>
				</>
			) : (
				<>
					<TableLoader />
				</>
			)}
		</TableWrapper>
	)
}

export default TokenTable
