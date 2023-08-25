import { useMemo } from 'react'
// import { useEnsAvatar, useEnsName, Address } from 'wagmi'
// import useActiveWeb3React from './useActiveWeb3React'
// import { CHAIN_ID } from 'config/constants/networks'
import { EthereumAddress } from 'config/constants/types'
import useActiveWeb3React from './useActiveWeb3React'

export const useDomainNameForAddress = (address: `0x${string}` | string, fetchData = true) => {
	// const { chainId } = useActiveWeb3React()
	// const { sidName, isLoading: isSidLoading } = useSidNameForAddress(address as EthereumAddress, fetchData)
	// const { unsName, isLoading: isUnsLoading } = useUnsNameForAddress(
	// 	address as EthereumAddress,
	// 	fetchData && !sidName && !isSidLoading,
	// )
	// const { data: ensName, isLoading: isEnsLoading } = useEnsName({
	// 	address: address as EthereumAddress,
	// 	chainId: parseInt(CHAIN_ID),
	// 	enabled: false, // TODO: Update later
	// })
	// const { data: ensAvatar, isLoading: isEnsAvatarLoading } = useEnsAvatar({
	// 	name: ensName,
	// 	chainId: parseInt(CHAIN_ID),
	// 	enabled: false,
	// })
	// return useMemo(() => {
	// 	return {
	// 		domainName: ensName,
	// 		avatar: ensAvatar ?? undefined,
	// 		isLoading: isEnsLoading || isEnsAvatarLoading,
	// 	}
	// }, [ensName, isEnsLoading, ensAvatar, isEnsAvatarLoading])
	return {
		domainName: '',
		avatar: undefined,
		isLoading: false,
	}
}
