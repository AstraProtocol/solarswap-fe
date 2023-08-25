import { TOKEN_BLACKLIST } from 'config/constants/info'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { infoClient } from 'utils/graphql'

interface TopTokensResponse {
	tokenDayDatas: {
		id: string
	}[]
}

/**
 * Tokens to display on Home page
 * The actual data is later requested in tokenData.ts
 * Note: dailyTxns_gt: 300 is there to prevent fetching incorrectly priced tokens with high dailyVolumeUSD
 */
const fetchTopTokens = async (timestamp24hAgo: number): Promise<string[]> => {
	try {
		const query = gql`
			query topTokens($blacklist: [String!]) {
				tokenDayDatas(
					first: 2
					where: { dailyTxns_gt: 0, id_not_in: $blacklist }
					orderBy: dailyVolumeUSD
					orderDirection: desc
				) {
					id
				}
			}
		`
		const data = await infoClient.request<TopTokensResponse>(query, { blacklist: TOKEN_BLACKLIST })
		// tokenDayDatas id has compound id "0xTOKENADDRESS-NUMBERS", extracting token address with .split('-')
		return data.tokenDayDatas.map(t => t.id.split('-')[0])
	} catch (error) {
		console.error('Failed to fetch top tokens', error)
		return []
	}
}

export const fetchTokenAddresses = async () => {
	const [, , , timestamp24hAgo] = getDeltaTimestamps()

	const addresses = await fetchTopTokens(timestamp24hAgo)

	return addresses
}

/**
 * Fetch top addresses by volume
 */
const useTopTokenAddresses = (): string[] => {
	const [topTokenAddresses, setTopTokenAddresses] = useState([])
	const [timestamp24hAgo] = getDeltaTimestamps()

	useEffect(() => {
		const fetch = async () => {
			const addresses = await fetchTopTokens(timestamp24hAgo)
			setTopTokenAddresses(addresses)
		}
		if (topTokenAddresses.length === 0) {
			fetch()
		}
	}, [topTokenAddresses, timestamp24hAgo])

	return topTokenAddresses
}

export default useTopTokenAddresses
