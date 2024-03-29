// import { useMemo } from 'react'
// import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
// import { useCurrentBlock } from 'state/block/hooks'

export type BuildStatus = 'idle' | 'coming_soon' | 'live' | 'finished'
export const getStatus = (currentBlock: number, startBlock: number, endBlock: number): BuildStatus => {
	// Add an extra check to currentBlock because it takes awhile to fetch so the initial value is 0
	// making the UI change to an inaccurate status
	if (currentBlock === 0) {
		return 'idle'
	}

	if (currentBlock < startBlock) {
		return 'coming_soon'
	}

	if (currentBlock >= startBlock && currentBlock <= endBlock) {
		return 'live'
	}

	if (currentBlock > endBlock) {
		return 'finished'
	}

	return 'idle'
}

export default null

export const useMenuItemsStatus = (): Record<string, string> => {
	// const currentBlock = useCurrentBlock()
	return {
		ifo: 'soon',
	}
	// const ifoStatus =
	//   currentBlock && activeIfo && activeIfo.endBlock > currentBlock
	//     ? getStatus(currentBlock, activeIfo.startBlock, activeIfo.endBlock)
	//     : null

	// return useMemo(() => {
	//   return ifoStatus
	//     ? {
	//         '/ifo': ifoStatus === 'coming_soon' ? 'soon' : ifoStatus,
	//       }
	//     : null
	// }, [ifoStatus])
}
