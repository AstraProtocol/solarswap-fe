/* eslint-disable no-nested-ternary */

import { NextSeo } from 'next-seo'

import Page from 'components/Layout/Page'
import { useMemo } from 'react'

import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import { usePoolDatasSWR, usePoolsForTokenSWR, useTokenDataSWR, useTokenTransactionsSWR } from 'state/info/hooks'
import Card from 'components/Card'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Row } from '@astraprotocol/astra-ui'
import Heading from 'components/Heading'
import { useTranslation } from 'contexts/Localization'
import Spinner from 'components/Loader/Spinner'
import TokenInfoNav from './components/Nav'
import TokenInfoHeader from './components/Header'
import TokenInfoOverview from './components/Overview'

const TokenPage: React.FC<React.PropsWithChildren<{ routeAddress: string }>> = ({ routeAddress }) => {
	const { t } = useTranslation()

	const address = routeAddress.toLowerCase()

	const tokenData = useTokenDataSWR(address)
	const poolsForToken = usePoolsForTokenSWR(address)
	const poolDatas = usePoolDatasSWR(useMemo(() => poolsForToken ?? [], [poolsForToken]))
	const transactions = useTokenTransactionsSWR(address)

	const TokenComponent = useMemo(() => {
		if (!tokenData) return

		return (
			<>
				{/* Stuff on top */}
				<TokenInfoNav address={address} tokenData={tokenData} />
				<TokenInfoHeader address={address} tokenData={tokenData} />
				{/* data on the right side of chart */}
				<TokenInfoOverview address={address} tokenData={tokenData} />
				{/* pools tables */}
				<Heading scale="lg" style={{ marginBottom: 16, marginTop: 40 }}>
					{t('Pairs')}
				</Heading>
				<PoolTable poolDatas={poolDatas} />
				{/* transaction tables */}
				<Heading scale="lg" style={{ marginBottom: 16, marginTop: 40 }}>
					{t('Transactions')}
				</Heading>
				<TransactionTable transactions={transactions} />
			</>
		)
	}, [address, poolDatas, t, tokenData, transactions])

	return (
		<Page>
			<NextSeo title={tokenData?.symbol} />

			{tokenData ? (
				!tokenData.exists ? (
					<Card>
						<div className="padding-md">
							<span className="text text-base">
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
					TokenComponent
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
