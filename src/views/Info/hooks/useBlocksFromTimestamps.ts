import { useEffect, useState } from 'react'
import { Block } from 'state/info/types'
import useSWRImmutable from 'swr/immutable'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'

/**
 * for a given array of timestamps, returns block entities
 * @param timestamps
 * @param sortDirection
 * @param skipCount
 */
export const useBlocksFromTimestamps = (
	timestamps: number[],
	sortDirection: 'asc' | 'desc' = 'desc',
	skipCount = 1000,
): {
	blocks?: Block[]
	error: boolean
} => {
	const [blocks, setBlocks] = useState<Block[]>()
	const [error, setError] = useState(false)

	const timestampsString = JSON.stringify(timestamps)
	const blocksString = blocks ? JSON.stringify(blocks) : undefined

	useEffect(() => {
		const fetchData = async () => {
			const timestampsArray = JSON.parse(timestampsString)
			const result = await getBlocksFromTimestamps(timestampsArray, sortDirection, skipCount)
			if (result.length === 0) {
				setError(true)
			} else {
				setBlocks(result)
			}
		}
		const blocksArray = blocksString ? JSON.parse(blocksString) : undefined
		if (!blocksArray && !error) {
			fetchData()
		}
	}, [blocksString, error, skipCount, sortDirection, timestampsString])

	return {
		blocks,
		error,
	}
}

export const useBlockFromTimeStampSWR = (
	timestamps: number[],
	sortDirection: 'asc' | 'desc' | undefined = 'desc',
	skipCount: number | undefined = 1000,
) => {
	const timestampsString = JSON.stringify(timestamps)
	const timestampsArray = JSON.parse(timestampsString)
	const { data } = useSWRImmutable([`info/blocks/${timestampsString}/`], () =>
		getBlocksFromTimestamps(timestampsArray, sortDirection, skipCount),
	)
	return { blocks: data }
}
