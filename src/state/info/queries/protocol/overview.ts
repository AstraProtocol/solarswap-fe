import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { ProtocolData } from 'state/info/types'
import { infoClient } from 'utils/graphql'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getChangeForPeriod, getPercentChange } from 'views/Info/utils/infoDataHelpers'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'

interface SolarFactory {
	totalTransactions: string
	totalVolumeUSD: string
	totalLiquidityUSD: string
}

interface OverviewResponse {
	solarFactories: SolarFactory[]
}

/**
 * Latest Liquidity, Volume and Transaction count
 */
const getOverviewData = async (block?: number): Promise<{ data?: OverviewResponse; error: boolean }> => {
	try {
		const query = gql`query overview {
      solarFactories(
        ${block ? `block: { number: ${block}}` : ``}
        first: 1) {
        totalTransactions
        totalVolumeUSD
        totalLiquidityUSD
      }
    }`
		const data = await infoClient.request<OverviewResponse>(query)
		return { data, error: false }
	} catch (error) {
		console.error('Failed to fetch info overview', error)
		return { data: null, error: true }
	}
}

const formatSolarFactoryResponse = (rawSolarFactory?: SolarFactory) => {
	if (rawSolarFactory) {
		return {
			totalTransactions: parseFloat(rawSolarFactory.totalTransactions),
			totalVolumeUSD: parseFloat(rawSolarFactory.totalVolumeUSD),
			totalLiquidityUSD: parseFloat(rawSolarFactory.totalLiquidityUSD)
		}
	}
	return null
}

interface ProtocolFetchState {
	error: boolean
	data?: ProtocolData
}

const useFetchProtocolData = (): ProtocolFetchState => {
	const [fetchState, setFetchState] = useState<ProtocolFetchState>({
		error: false
	})
	const [t24, t48] = getDeltaTimestamps()
	const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48])
	const [block24, block48] = blocks ?? []

	useEffect(() => {
		const fetch = async () => {
			const { error, data } = await getOverviewData()
			const { error: error24, data: data24 } = await getOverviewData(block24?.number ?? undefined)
			const { error: error48, data: data48 } = await getOverviewData(block48?.number ?? undefined)
			const anyError = error || error24 || error48
			const overviewData = formatSolarFactoryResponse(data?.solarFactories?.[0])
			const overviewData24 = formatSolarFactoryResponse(data24?.solarFactories?.[0])
			const overviewData48 = formatSolarFactoryResponse(data48?.solarFactories?.[0])
			const allDataAvailable = overviewData && overviewData24 && overviewData48
			if (anyError || !allDataAvailable) {
				setFetchState({
					error: true
				})
			} else {
				const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
					overviewData.totalVolumeUSD,
					overviewData24.totalVolumeUSD,
					overviewData48.totalVolumeUSD
				)
				const liquidityUSDChange = getPercentChange(
					overviewData.totalLiquidityUSD,
					overviewData24.totalLiquidityUSD
				)
				// 24H transactions
				const [txCount, txCountChange] = getChangeForPeriod(
					overviewData.totalTransactions,
					overviewData24.totalTransactions,
					overviewData48.totalTransactions
				)
				const protocolData: ProtocolData = {
					volumeUSD,
					volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
					liquidityUSD: overviewData.totalLiquidityUSD,
					liquidityUSDChange,
					txCount,
					txCountChange
				}
				setFetchState({
					error: false,
					data: protocolData
				})
			}
		}
		const allBlocksAvailable = block24?.number && block48?.number
		if (allBlocksAvailable && !blockError && !fetchState.data) {
			fetch()
		}
	}, [block24, block48, blockError, fetchState])

	return fetchState
}

export default useFetchProtocolData
