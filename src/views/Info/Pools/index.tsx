import Page from 'components/Layout/Page'
import { useMemo } from 'react'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { usePoolsData } from '../hooks/usePoolsData'
import { useTranslation } from 'contexts/Localization'
import { CHAIN_ID } from 'config/constants/networks'
import useInfoUserSavedTokensAndPools from 'hooks/useInfoUserSavedTokensAndPoolsList'
import { usePoolDatasSWR } from 'state/info/hooks'
import Heading from 'components/Heading'
import Card from 'components/Card'

const PoolsOverview: React.FC<React.PropsWithChildren> = () => {
	const { t } = useTranslation()
	const { poolsData, stableSwapsAprs } = usePoolsData()
	const { savedPools } = useInfoUserSavedTokensAndPools(parseInt(CHAIN_ID))
	const watchlistPools = usePoolDatasSWR(savedPools)
	const watchlistPoolsData = useMemo(
		() =>
			watchlistPools.map(pool => {
				return { ...pool, ...(stableSwapsAprs && { lpApr7d: stableSwapsAprs[pool.address] }) }
			}),
		[watchlistPools, stableSwapsAprs],
	)

	return (
		<Page>
			<Heading scale="lg" className="margin-bottom-md">
				{t('Your Watchlist')}
			</Heading>
			<Card>
				{watchlistPools.length > 0 ? (
					<PoolTable poolDatas={watchlistPoolsData} />
				) : (
					<span className="text text-base">{t('Saved pairs will appear here')}</span>
				)}
			</Card>
			<Heading scale="lg" style={{ marginTop: 40, marginBottom: 16 }} id="info-pools-title">
				{t('All Pairs')}
			</Heading>
			<PoolTable poolDatas={poolsData} />
		</Page>
	)
}

export default PoolsOverview
