import Page from 'components/Layout/Page'
import { cloneElement, useMemo } from 'react'
import {
	useAllTokenDataSWR,
	useProtocolChartDataSWR,
	useProtocolDataSWR,
	useProtocolTransactionsSWR,
} from 'state/info/hooks'
import BarChart from 'views/Info/components/InfoCharts/BarChart'
import LineChart from 'views/Info/components/InfoCharts/LineChart'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import HoverableChart from '../components/InfoCharts/HoverableChart'
import { usePoolsData } from '../hooks/usePoolsData'
import { useTranslation } from 'contexts/Localization'
import clsx from 'clsx'
import styles from './styles.module.scss'
import Heading from 'components/Heading'
import Card from 'components/Card'
import { isArray } from 'lodash'

export const ChartCardsContainer = ({ children }) => {
	if (isArray(children))
		return (
			<div className={clsx('flex row', styles.chartCardsContainer)}>
				{children.map((c, index) => cloneElement(c, { key: index }))}
			</div>
		)
	return <div className={clsx('flex row', styles.chartCardsContainer)}>{children}</div>
}

const Overview: React.FC<React.PropsWithChildren> = () => {
	const {
		t,
		currentLanguage: { locale },
	} = useTranslation()

	const protocolData = useProtocolDataSWR()
	const chartData = useProtocolChartDataSWR()
	const transactions = useProtocolTransactionsSWR()

	const currentDate = useMemo(
		() => new Date().toLocaleString(locale, { month: 'short', year: 'numeric', day: 'numeric' }),
		[locale],
	)

	const allTokens = useAllTokenDataSWR()

	const formattedTokens = useMemo(() => {
		return Object.values(allTokens)
			.map(token => token.data)
			.filter(token => token.name !== 'unknown')
	}, [allTokens])

	const { poolsData } = usePoolsData()

	const somePoolsAreLoading = useMemo(() => {
		return poolsData.some(pool => !pool?.token0Price)
	}, [poolsData])

	return (
		<Page>
			<Heading scale="lg" className="margin-left-md" id="info-overview-title">
				{t('Solarswap Info & Analytics')}
			</Heading>
			<ChartCardsContainer>
				<Card>
					<HoverableChart
						chartData={chartData}
						protocolData={protocolData}
						currentDate={currentDate}
						valueProperty="liquidityUSD"
						title={t('Liquidity')}
						ChartComponent={LineChart}
					/>
				</Card>
				<Card>
					<HoverableChart
						chartData={chartData}
						protocolData={protocolData}
						currentDate={currentDate}
						valueProperty="volumeUSD"
						title={t('Volume 24H')}
						ChartComponent={BarChart}
					/>
				</Card>
			</ChartCardsContainer>
			<Heading scale="lg" className="margin-left-md margin-top-xl">
				{t('Top Tokens')}
			</Heading>
			<TokenTable tokenDatas={formattedTokens} />
			<Heading scale="lg" className="margin-left-md margin-top-xl">
				{t('Top Pairs')}
			</Heading>
			<PoolTable poolDatas={poolsData} loading={somePoolsAreLoading} />
			<Heading scale="lg" className="margin-left-md margin-top-xl">
				{t('Transactions')}
			</Heading>
			<TransactionTable transactions={transactions} />
		</Page>
	)
}

export default Overview
