/* eslint-disable no-nested-ternary */

import { NextSeo } from 'next-seo'

import Page from 'components/Layout/Page'
import { ONE_HOUR_SECONDS } from 'config/constants/info'
import { Duration } from 'date-fns'
import { useMemo } from 'react'

import { getAstraExplorerLink } from 'utils'
import { formatAmount } from 'utils/formatInfoNumbers'
import ChartCard from 'views/Info/components/InfoCharts/ChartCard'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import Percent from 'views/Info/components/Percent'
import SaveIcon from 'views/Info/components/SaveIcon'
import useCMCLink from 'views/Info/hooks/useCMCLink'
import {
	usePoolDatasSWR,
	usePoolsForTokenSWR,
	useStableSwapPath,
	useTokenChartDataSWR,
	useTokenDataSWR,
	useTokenDatasSWR,
	useTokenPriceDataSWR,
	useTokenTransactionsSWR,
} from 'state/info/hooks'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import { CHAIN_ID } from 'config/constants/networks'
import useInfoUserSavedTokensAndPools from 'hooks/useInfoUserSavedTokensAndPoolsList'
import style from './style.module.scss'
import Card from 'components/Card'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { NormalButton, Row, Typography } from '@astraprotocol/astra-ui'
import truncateHash from 'utils/truncateHash'
import { subgraphTokenName, subgraphTokenSymbol } from 'state/info/constant'
import Heading from 'components/Heading'
import clsx from 'clsx'
import { useTranslation } from 'contexts/Localization'
import { CurrencyLogo } from 'components/Logo'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { Token } from '@solarswap/sdk'
import Spinner from 'components/Loader/Spinner'

const ContentLayout = ({ children }) => <div className={style.contentLayout}>{children}</div>

const DEFAULT_TIME_WINDOW: Duration = { weeks: 1 }

const TokenPage: React.FC<React.PropsWithChildren<{ routeAddress: string }>> = ({ routeAddress }) => {
	const { isXs, isSm } = useMatchBreakpoints()
	const { t } = useTranslation()

	const address = routeAddress.toLowerCase()

	const tokenData = useTokenDataSWR(address)
	const poolsForToken = usePoolsForTokenSWR(address)
	const poolDatas = usePoolDatasSWR(useMemo(() => poolsForToken ?? [], [poolsForToken]))
	const transactions = useTokenTransactionsSWR(address)
	const chartData = useTokenChartDataSWR(address)

	// pricing data
	const priceData = useTokenPriceDataSWR(address, ONE_HOUR_SECONDS, DEFAULT_TIME_WINDOW)
	const adjustedPriceData = useMemo(() => {
		// Include latest available price
		if (priceData && tokenData && priceData.length > 0) {
			return [
				...priceData,
				{
					time: Date.now() / 1000,
					open: priceData[priceData.length - 1].close,
					close: tokenData?.priceUSD,
					high: tokenData?.priceUSD,
					low: priceData[priceData.length - 1].close,
				},
			]
		}
		return undefined
	}, [priceData, tokenData])

	const infoTypeParam = useStableSwapPath()

	const token = new Token(parseInt(CHAIN_ID), address, 18, '')

	return (
		<Page>
			<NextSeo title={tokenData?.symbol} />
			{tokenData ? (
				!tokenData.exists ? (
					<Card>
						<div className="padding-md">
							<span>
								{t('No pair has been created with this token yet. Create one')}
								<NextLinkFromReactRouter
									style={{ display: 'inline', marginLeft: '6px' }}
									to={`/add/${address}`}
								>
									{t('here.')}
								</NextLinkFromReactRouter>
							</span>
						</div>
					</Card>
				) : (
					<>
						{/* Stuff on top */}
						<Row className="margin-bottom-lg margin-top-sm ">
							<Breadcrumbs className="margin-bottom-lg">
								<NextLinkFromReactRouter to={`/info${infoTypeParam}`}>
									<span className="text text-base">{t('Info')}</span>
								</NextLinkFromReactRouter>
								<NextLinkFromReactRouter to={`/info/tokens${infoTypeParam}`}>
									<span className="text text-base">{t('Tokens')}</span>
								</NextLinkFromReactRouter>
								<Row>
									<span className="text text-base margin-right-sm">{tokenData.symbol}</span>
									<span>{`(${truncateHash(address)})`}</span>
								</Row>
							</Breadcrumbs>
							<div>
								<Typography.Link target="_blank" href={getAstraExplorerLink(address, 'address')}>
									({t('View on AstraExplorer')})
								</Typography.Link>
							</div>
						</Row>
						<Row className="flex-justify-space-between">
							<div className="margin-bottom-sm">
								<Row className="flex-align-center">
									<CurrencyLogo size={32} currency={token} />
									<span
										className={clsx('text text-bold margin-left-sm text-2xl', {
											['text-lg']: isXs || isSm,
										})}
										id="info-token-name-title"
									>
										{subgraphTokenName[tokenData.address] ?? tokenData.name}
									</span>
									<span
										className={clsx('text text-bold margin-left-sm text-lg', {
											['text-sm']: isXs || isSm,
										})}
									>
										({subgraphTokenSymbol[tokenData.address] ?? tokenData.symbol})
									</span>
								</Row>
								<Row className="margin-top-sm margin-left-2xl flex-align-center">
									<span className="margin-right-md text text-bold text-lg">
										${formatAmount(tokenData.priceUSD, { notation: 'standard' })}
									</span>
									<Percent value={tokenData.priceUSDChange} className="text text-bold" />
								</Row>
							</div>
							<div>
								<NextLinkFromReactRouter to={`/add/${address}`}>
									<NormalButton variant="default" classes={{ other: 'margin-right-sm' }}>
										<span className="text text-base text-bold">{t('Add Liquidity')}</span>
									</NormalButton>
								</NextLinkFromReactRouter>
								<NextLinkFromReactRouter to={`/swap?outputCurrency=${address}`}>
									<NormalButton>
										<span className="text text-base text-bold">{t('Trade')}</span>
									</NormalButton>
								</NextLinkFromReactRouter>
							</div>
						</Row>

						{/* data on the right side of chart */}
						<ContentLayout>
							<Card className="padding-lg">
								<span className="text text-sm text-bold secondary-color-normal text-uppercase">
									{t('Liquidity')}
								</span>
								<br />
								<span className="money money-md money-bold">
									${formatAmount(tokenData.liquidityUSD)}
								</span>
								<br />
								<Percent value={tokenData.liquidityUSDChange} />

								<div className="margin-top-xs text text-sm text-bold secondary-color-normal text-uppercase">
									{t('Volume 24H')}
								</div>
								{/* <br /> */}
								<span className="money money-md money-bold money-uppercase">
									${formatAmount(tokenData.volumeUSD)}
								</span>
								<br />
								<Percent value={tokenData.volumeUSDChange} />

								<div className="margin-top-md text text-bold text-sm text-bold text-uppercase secondary-color-normal">
									{t('Volume 7D')}
								</div>
								{/* <br /> */}
								<span className="money money-md money-bold">
									${formatAmount(tokenData.volumeUSDWeek)}
								</span>

								<div className="margin-top-md text text-sm text-bold secondary-color-normal text-uppercase">
									{t('Transactions 24H')}
								</div>
								{/* <br /> */}
								<span className="money money-md money-bold">
									{formatAmount(tokenData.txCount, { isInteger: true })}
								</span>
							</Card>
							{/* charts card */}
							<ChartCard
								variant="token"
								chartData={chartData}
								tokenData={tokenData}
								tokenPriceData={adjustedPriceData}
							/>
						</ContentLayout>

						{/* pools and transaction tables */}
						<Heading scale="lg" style={{ marginBottom: 16, marginTop: 40 }}>
							{t('Pairs')}
						</Heading>

						<PoolTable poolDatas={poolDatas} />

						<Heading scale="lg" style={{ marginBottom: 16, marginTop: 40 }}>
							{t('Transactions')}
						</Heading>

						<TransactionTable transactions={transactions} />
					</>
				)
			) : (
				<Row style={{ justifyContent: 'center', marginTop: 80 }}>
					<Spinner />
				</Row>
			)}
		</Page>
	)
}

export default TokenPage
