import { useContext } from 'react'
import { FarmsPageLayout, FarmsContext } from 'views/Farms'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import { getDisplayApr } from 'views/Farms/Farms'
import { usePriceAstraBusd } from 'state/farms/hooks'
import { useWeb3React } from '@web3-react/core'

const FarmsPage = () => {
	const { account } = useWeb3React()
	const { chosenFarmsMemoized } = useContext(FarmsContext)
	const astraPrice = usePriceAstraBusd()

	return (
		<>
			{chosenFarmsMemoized.map(farm => (
				<FarmCard
					key={farm.pid}
					farm={farm}
					displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
					astraPrice={astraPrice}
					account={account}
					removed={false}
				/>
			))}
		</>
	)
}

FarmsPage.Layout = FarmsPageLayout

export default FarmsPage
