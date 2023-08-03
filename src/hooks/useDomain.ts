import { useMemo } from 'react'
import { useEnsAvatar, useEnsName, Address } from 'wagmi'
// import useActiveWeb3React from './useActiveWeb3React'
import { CHAIN_ID } from 'config/constants/networks'

export const useDomainNameForAddress = (address: `0x${string}` | string, fetchData = true) => {
	// const { chainId } = useActiveWeb3React()
	// const { sidName, isLoading: isSidLoading } = useSidNameForAddress(address as Address, fetchData)
	// const { unsName, isLoading: isUnsLoading } = useUnsNameForAddress(
	// 	address as Address,
	// 	fetchData && !sidName && !isSidLoading,
	// )
	const { data: ensName, isLoading: isEnsLoading } = useEnsName({
		address: address as Address,
		chainId: parseInt(CHAIN_ID),
		enabled: false, // TODO: Update later
	})
	const { data: ensAvatar, isLoading: isEnsAvatarLoading } = useEnsAvatar({
		name: ensName,
		chainId: parseInt(CHAIN_ID),
		enabled: false,
	})

	return useMemo(() => {
		return {
			domainName: ensName,
			avatar: ensAvatar ?? undefined,
			isLoading: isEnsLoading || isEnsAvatarLoading,
		}
	}, [ensName, isEnsLoading, ensAvatar, isEnsAvatarLoading])
}
