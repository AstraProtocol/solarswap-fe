import { useState } from 'react'
import BigNumber from 'bignumber.js'

import { getAstraExplorerLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
// import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import { FarmWithStakedValue } from '../types'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'
import Skeleton from 'react-loading-skeleton'
import ExpandableSectionButton from 'components/ExpandableSectionButton'

// const StyledCard = styled(Card)`
// 	align-self: baseline;
// `

// const FarmCardInnerContainer = styled(Flex)`
// 	flex-direction: column;
// 	justify-content: space-around;
// 	padding: 24px;
// `

// const ExpandingWrapper = styled.div`
// 	padding: 24px;
// 	border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
// 	overflow: hidden;
// `

interface FarmCardProps {
	farm: FarmWithStakedValue
	displayApr: string
	removed: boolean
	astraPrice?: BigNumber
	account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, displayApr, removed, astraPrice, account }) => {
	const { t } = useTranslation()

	const [showExpandableSection, setShowExpandableSection] = useState(false)

	const totalValueFormatted =
		farm.liquidity && farm.liquidity.gt(0)
			? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
			: ''

	const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
	const earnLabel = farm.dual ? farm.dual.earnLabel : t('ASA + Fees')

	const liquidityUrlPathParts = getLiquidityUrlPathParts({
		quoteTokenAddress: farm.quoteToken.address,
		tokenAddress: farm.token.address,
	})
	const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
	const lpAddress = getAddress(farm.lpAddresses)
	const isPromotedFarm = farm.token.symbol === 'WASA'

	return (
		<div
			className="border border-base border-bottom-lg radius-lg same-bg-color-20"
			style={{ alignSelf: 'baseline', minWidth: 320 }}
		>
			<div className="flex col flex-justify-space-around padding-lg">
				<CardHeading
					lpLabel={lpLabel}
					multiplier={farm.multiplier}
					isCommunityFarm={farm.isCommunity}
					token={farm.token}
					quoteToken={farm.quoteToken}
				/>
				{!removed && (
					<div className="flex flex-justify-space-between flex-align-center">
						<span className="text text-base">{t('APR')}:</span>
						<span className="text text-center text-bold flex flex-align-center">
							{farm.apr ? (
								<ApyButton
									variant="text-and-button"
									pid={farm.pid}
									lpSymbol={farm.lpSymbol}
									multiplier={farm.multiplier}
									lpLabel={lpLabel}
									addLiquidityUrl={addLiquidityUrl}
									astraPrice={astraPrice}
									apr={farm.apr}
									displayApr={displayApr}
								/>
							) : (
								<Skeleton baseColor="#312e39" height={24} width={80} />
							)}
						</span>
					</div>
				)}
				<div className="flex flex-justify-space-between">
					<span className="text text-base">{t('Earn')}:</span>
					<span className="text text-base text-bold">{earnLabel}</span>
				</div>
				<CardActionsContainer
					farm={farm}
					lpLabel={lpLabel}
					account={account}
					addLiquidityUrl={addLiquidityUrl}
					displayApr={displayApr}
				/>
			</div>
			<div className="padding-lg border border-top-lg" style={{ overflow: 'hidden' }}>
				<ExpandableSectionButton
					onClick={() => setShowExpandableSection(!showExpandableSection)}
					expanded={showExpandableSection}
				/>
				{showExpandableSection && (
					<DetailsSection
						removed={removed}
						bscScanAddress={getAstraExplorerLink(lpAddress, 'address')}
						infoAddress={`/info/pool/${lpAddress}`}
						totalValueFormatted={totalValueFormatted}
						lpLabel={lpLabel}
						addLiquidityUrl={addLiquidityUrl}
					/>
				)}
			</div>
		</div>
	)
}

export default FarmCard
