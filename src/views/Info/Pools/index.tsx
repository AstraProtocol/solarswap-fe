import Page from 'components/Layout/Page'
import { useMemo } from 'react'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { usePoolsData } from '../hooks/usePoolsData'
import { useTranslation } from 'contexts/Localization'
import { CHAIN_ID } from 'config/constants/networks'
import useInfoUserSavedTokensAndPools from 'hooks/useInfoUserSavedTokensAndPoolsList'
import { usePoolDatasSWR } from 'state/info/hooks'

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
			{/* <Heading scale="lg" mb="16px">
				{t('Your Watchlist')}
			</Heading>
			<Card>
				{watchlistPools.length > 0 ? (
					<PoolTable poolDatas={watchlistPoolsData} />
				) : (
					<Text px="24px" py="16px">
						{t('Saved pairs will appear here')}
					</Text>
				)}
			</Card>
			<Heading scale="lg" mt="40px" mb="16px" id="info-pools-title">
				{t('All Pairs')}
			</Heading> */}
			<PoolTable poolDatas={poolsData} />
		</Page>
	)
}

export default PoolsOverview
