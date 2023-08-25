import Page from 'components/Layout/Page'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { usePoolsData } from '../hooks/usePoolsData'
import { useTranslation } from 'contexts/Localization'
import Heading from 'components/Heading'

const PoolsOverview: React.FC<React.PropsWithChildren> = () => {
	const { t } = useTranslation()
	const { poolsData, stableSwapsAprs } = usePoolsData()

	return (
		<Page>
			<Heading scale="lg" style={{ marginTop: 40, marginBottom: 16 }} id="info-pools-title">
				{t('All Pairs')}
			</Heading>
			<PoolTable poolDatas={poolsData} />
		</Page>
	)
}

export default PoolsOverview
