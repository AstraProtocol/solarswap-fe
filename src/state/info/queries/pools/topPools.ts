import { TOKEN_BLACKLIST } from 'config/constants/info'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { infoClient } from 'utils/graphql'

interface TopPoolsResponse {
	pairDayDatas: {
		id: string
	}[]
}

/**
 * Initial pools to display on the home page
 */
const fetchTopPools = async (timestamp24hAgo: number): Promise<string[]> => {
	try {
		const query = gql`
			query topPools($blacklist: [String!]) {
				pairDayDatas(
					first: 1
					where: { dailyTxns_gt: 0, token0_not_in: $blacklist, token1_not_in: $blacklist }
					orderBy: dailyVolumeUSD
					orderDirection: desc
				) {
					id
				}
			}
		`
		const data = await infoClient.request<TopPoolsResponse>(query, { blacklist: TOKEN_BLACKLIST })
		// pairDayDatas id has compound id "0xPOOLADDRESS-NUMBERS", extracting pool address with .split('-')
		return data.pairDayDatas.map(p => p.id.split('-')[0])
	} catch (error) {
		console.error('Failed to fetch top pools', error)
		return []
	}
}

/**
 * Fetch top addresses by volume
 */
const useTopPoolAddresses = (): string[] => {
	const [topPoolAddresses, setTopPoolAddresses] = useState([])
	const [timestamp24hAgo] = getDeltaTimestamps()

	useEffect(() => {
		const fetch = async () => {
			const addresses = await fetchTopPools(timestamp24hAgo)
			setTopPoolAddresses(addresses)
		}
		if (topPoolAddresses.length === 0) {
			fetch()
		}
	}, [topPoolAddresses, timestamp24hAgo])

	return topPoolAddresses
}

export const fetchTopPoolAddresses = async () => {
	const [timestamp24hAgo] = getDeltaTimestamps()

	const addresses = await fetchTopPools(timestamp24hAgo)
	return addresses
}

export default useTopPoolAddresses
