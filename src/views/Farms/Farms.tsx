import { useEffect, useCallback, useState, useMemo, useRef, createContext } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'

import { ChainId } from '@solarswap/sdk'

import Page from 'components/Layout/Page'
import { useFarms, usePollFarmsWithUserData, usePriceAstraBusd } from 'state/farms/hooks'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { DeserializedFarm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
import orderBy from 'lodash/orderBy'
import isArchivedPid from 'utils/farmHelpers'
import { latinise } from 'utils/latinise'
import { useUserFarmStakedOnly, useUserFarmsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
// import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import { Select, Toggle, Spinner, Container } from '@astraprotocol/astra-ui'
import ToggleView from 'components/ToggleView/ToggleView'
import Table from './components/FarmTable/FarmTable'
import FarmTabButtons from './components/FarmTabButtons'
import { RowProps } from './components/FarmTable/Row'
import { DesktopColumnSchema, FarmWithStakedValue } from './components/types'
import Image from 'next/image'
import styles from './styles.module.scss'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import clsx from 'clsx'
import { OptionProps } from '@astraprotocol/astra-ui/lib/es/components/Select'

const NUMBER_OF_FARMS_VISIBLE = 12

export const getDisplayApr = (asaRewardsApr?: number, lpRewardsApr?: number) => {
	if (asaRewardsApr && lpRewardsApr) {
		return (asaRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
	}
	if (asaRewardsApr) {
		return asaRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
	}
	return null
}

interface Props {
	children: JSX.Element | JSX.Element[] | string | string[]
}

const Farms: React.FC<Props> = ({ children }: Props) => {
	const { pathname } = useRouter()
	const { t } = useTranslation()
	const { data: farmsLP, userDataLoaded, poolLength } = useFarms()
	const astraPrice = usePriceAstraBusd()
	const [query, setQuery] = useState('')
	const [viewMode, setViewMode] = useUserFarmsViewMode()
	const { account } = useWeb3React()
	const [sortOption, setSortOption] = useState('hot')
	const { observerRef, isIntersecting } = useIntersectionObserver()
	const chosenFarmsLength = useRef(0)
	const { isMobile } = useMatchBreakpoints()

	const isArchived = pathname.includes('archived')
	const isInactive = pathname.includes('history')
	const isActive = !isInactive && !isArchived

	usePollFarmsWithUserData(isArchived)

	// Users with no wallet connected should see 0 as Earned amount
	// Connected users should see loading indicator until first userData has loaded
	const userDataReady = !account || (!!account && userDataLoaded)

	const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)

	console.log('farmsLP :>> ', farmsLP)

	const activeFarms = farmsLP.filter(
		farm =>
			farm.pid !== 0 &&
			farm.multiplier !== '0X' &&
			!isArchivedPid(farm.pid) &&
			(!poolLength || poolLength > farm.pid)
	)
	const inactiveFarms = farmsLP.filter(farm => farm.pid !== 0 && farm.multiplier === '0X' && !isArchivedPid(farm.pid))
	const archivedFarms = farmsLP.filter(farm => isArchivedPid(farm.pid))

	const stakedOnlyFarms = activeFarms.filter(
		farm => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
	)

	const stakedInactiveFarms = inactiveFarms.filter(
		farm => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
	)

	const stakedArchivedFarms = archivedFarms.filter(
		farm => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
	)

	const farmsList = useCallback(
		(farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
			let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map(farm => {
				if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
					return farm
				}
				const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
				const { asaRewardsApr, lpRewardsApr } = isActive
					? getFarmApr(
							new BigNumber(farm.poolWeight),
							astraPrice,
							totalLiquidity,
							farm.lpAddresses[ChainId.TESTNET]
					  )
					: { asaRewardsApr: 0, lpRewardsApr: 0 }

				return { ...farm, apr: asaRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
			})

			if (query) {
				const lowercaseQuery = latinise(query.toLowerCase())
				farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
					return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
				})
			}
			return farmsToDisplayWithAPR
		},
		[astraPrice, query, isActive]
	)

	const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value)
	}

	const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

	const chosenFarmsMemoized = useMemo(() => {
		let chosenFarms = []

		const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
			switch (sortOption) {
				case 'apr':
					return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, 'desc')
				case 'multiplier':
					return orderBy(
						farms,
						(farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
						'desc'
					)
				case 'earned':
					return orderBy(
						farms,
						(farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
						'desc'
					)
				case 'liquidity':
					return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
				case 'latest':
					return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.pid), 'desc')
				default:
					return farms
			}
		}

		if (isActive) {
			chosenFarms = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
		}
		if (isInactive) {
			chosenFarms = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
		}
		if (isArchived) {
			chosenFarms = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
		}

		return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
	}, [
		sortOption,
		activeFarms,
		farmsList,
		inactiveFarms,
		archivedFarms,
		isActive,
		isInactive,
		isArchived,
		stakedArchivedFarms,
		stakedInactiveFarms,
		stakedOnly,
		stakedOnlyFarms,
		numberOfFarmsVisible
	])

	chosenFarmsLength.current = chosenFarmsMemoized.length

	useEffect(() => {
		if (isIntersecting) {
			setNumberOfFarmsVisible(farmsCurrentlyVisible => {
				if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
					return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
				}
				return farmsCurrentlyVisible
			})
		}
	}, [isIntersecting])

	const rowData = chosenFarmsMemoized.map(farm => {
		const { token, quoteToken } = farm
		const tokenAddress = token.address
		const quoteTokenAddress = quoteToken.address
		const lpLabel = farm.lpSymbol && farm.lpSymbol.split(' ')[0].toUpperCase().replace('WASA', '')

		// console.log('farm.multiplier :>> ', farm.multiplier)

		const row: RowProps = {
			apr: {
				value: getDisplayApr(farm.apr, farm.lpRewardsApr),
				pid: farm.pid,
				multiplier: farm.multiplier,
				lpLabel,
				lpSymbol: farm.lpSymbol,
				tokenAddress,
				quoteTokenAddress,
				astraPrice,
				originalValue: farm.apr
			},
			farm: {
				label: lpLabel,
				pid: farm.pid,
				token: farm.token,
				quoteToken: farm.quoteToken
			},
			earned: {
				earnings: getBalanceNumber(new BigNumber(farm.userData.earnings)),
				pid: farm.pid
			},
			liquidity: {
				liquidity: farm.liquidity
			},
			multiplier: {
				multiplier: farm.multiplier
			},
			details: farm
		}

		return row
	})

	const renderContent = (): JSX.Element => {
		if (viewMode === ViewMode.TABLE && rowData.length) {
			const columnSchema = DesktopColumnSchema

			const columns = columnSchema.map(column => ({
				id: column.id,
				name: column.name,
				label: column.label,
				sort: (a, b) => {
					switch (column.name) {
						case 'farm':
							return b.id - a.id
						case 'apr':
							if (a.original.apr.value && b.original.apr.value) {
								return Number(a.original.apr.value) - Number(b.original.apr.value)
							}

							return 0
						case 'earned':
							return a.original.earned.earnings - b.original.earned.earnings
						default:
							return 1
					}
				},
				sortable: column.sortable
			}))

			return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
		}

		return <div className="flex flex-justify-center">{children}</div>
	}

	const handleSortOptionChange = (option: OptionProps): void => {
		setSortOption(option.value)
	}

	return (
		<FarmsContext.Provider value={{ chosenFarmsMemoized }}>
			<Container>
				<div
					className={clsx('col', {
						['padding-top-xl padding-bottom-xl padding-left-lg padding-right-lg']: !isMobile,
						['padding-top-lg padding-bottom-lg padding-left-2xs padding-right-2xs']: isMobile
					})}
				>
					<span className="text text-4xl text-bold secondary-color-normal">{t('Farms')}</span>
					<span className="text text-xl">{t('Stake LP tokens to earn.')}</span>
				</div>
			</Container>

			<Page>
				<div className={styles.controlContainer}>
					<div className={styles.viewControl}>
						<ToggleView
							idPrefix="clickFarm"
							viewMode={viewMode}
							onToggle={(mode: ViewMode) => setViewMode(mode)}
						/>
						<div className="flex flex-align-center margin-left-md margin-right-md">
							<Toggle
								id="staked-only-farms"
								checked={stakedOnly}
								onChange={() => setStakedOnly(!stakedOnly)}
								scale="sm"
							/>
							<span className="text text-base margin-left-xs"> {t('Staked only')}</span>
						</div>
						<FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} />
					</div>
					<div className={styles.filterContainer}>
						<div>
							<span className="text text-sm text-uppercase contrast-color-70">{t('Sort by')}</span>
							<Select
								options={[
									{
										label: t('Hot'),
										value: 'hot'
									},
									{
										label: t('APR'),
										value: 'apr'
									},
									{
										label: t('Multiplier'),
										value: 'multiplier'
									},
									{
										label: t('Earned'),
										value: 'earned'
									},
									{
										label: t('Liquidity'),
										value: 'liquidity'
									},
									{
										label: t('Latest'),
										value: 'latest'
									}
								]}
								onOptionChange={handleSortOptionChange}
							/>
						</div>
						<div style={{ marginLeft: 16 }}>
							<span className="text text-sm text-uppercase contrast-color-70">{t('Search')}</span>
							<SearchInput onChange={handleChangeQuery} placeholder="Search Farms" />
						</div>
					</div>
				</div>
				{renderContent()}

				{account && !userDataLoaded && stakedOnly && (
					<div className="flex flex-justify-center">
						<Spinner />
					</div>
				)}
				<div ref={observerRef} />
				{/* <Image
					className={styles.image}
					src="/images/decorations/3dpan.png"
					alt="Solar illustration"
					width={120}
					height={103}
				/> */}
			</Page>
		</FarmsContext.Provider>
	)
}

export const FarmsContext = createContext({ chosenFarmsMemoized: [] })

export default Farms
