// import { BLOCKS_CLIENT, BLOCKS_CLIENT_ETH } from 'config/constants/endpoints'
// import { infoClientETH, infoClient, infoStableSwapClient, v2Clients } from 'utils/graphql'
// import { GraphQLClient } from 'graphql-request'

// import { ChainId } from '@pancakeswap/sdk'
// import { ETH_TOKEN_BLACKLIST, PCS_ETH_START, PCS_V2_START, TOKEN_BLACKLIST } from 'config/constants/info'
// import { bsc, mainnet, polygonZkEvm } from 'wagmi/chains'

// export type MultiChainName = 'BSC' | 'ETH' | 'POLYGON_ZKEVM'

// export type MultiChainNameExtend = MultiChainName | 'BSC_TESTNET' | 'ZKSYNC_TESTNET'

// export const multiChainName: Record<number | string, MultiChainNameExtend> = {
// 	[ChainId.BSC]: 'BSC',
// 	[ChainId.ETHEREUM]: 'ETH',
// 	[ChainId.BSC_TESTNET]: 'BSC_TESTNET',
// 	[ChainId.POLYGON_ZKEVM]: 'POLYGON_ZKEVM',
// }

// export const multiChainQueryMainToken: Record<MultiChainName, string> = {
// 	BSC: 'BNB',
// 	ETH: 'ETH',
// 	POLYGON_ZKEVM: 'ETH',
// }

// export const multiChainBlocksClient: Record<MultiChainNameExtend, string> = {
// 	BSC: BLOCKS_CLIENT,
// 	ETH: BLOCKS_CLIENT_ETH,
// 	BSC_TESTNET: 'https://api.thegraph.com/subgraphs/name/lengocphuc99/bsc_testnet-blocks',
// 	POLYGON_ZKEVM: 'https://api.studio.thegraph.com/query/45376/polygon-zkevm-block/version/latest',
// 	ZKSYNC_TESTNET: 'https://api.studio.thegraph.com/query/45376/blocks-zksync-testnet/version/latest',
// }

// export const multiChainStartTime = {
// 	BSC: PCS_V2_START,
// 	ETH: PCS_ETH_START,
// 	POLYGON_ZKEVM: 1686236845,
// }

// export const multiChainId: Record<MultiChainName, ChainId> = {
// 	BSC: ChainId.BSC,
// 	ETH: ChainId.ETHEREUM,
// 	POLYGON_ZKEVM: ChainId.POLYGON_ZKEVM,
// }

// export const multiChainPaths = {
// 	[ChainId.BSC]: '',
// 	[ChainId.ETHEREUM]: '/eth',
// 	[ChainId.POLYGON_ZKEVM]: '/polygon-zkevm',
// }

// export const multiChainQueryClient = {
// 	BSC: infoClient,
// 	ETH: infoClientETH,
// 	POLYGON_ZKEVM: v2Clients[ChainId.POLYGON_ZKEVM],
// }

// export const multiChainScan: Record<MultiChainName, string> = {
// 	BSC: bsc.blockExplorers.etherscan.name,
// 	ETH: mainnet.blockExplorers.etherscan.name,
// 	POLYGON_ZKEVM: polygonZkEvm.blockExplorers.default.name,
// }

// export const multiChainTokenBlackList: Record<MultiChainName, string[]> = {
// 	BSC: TOKEN_BLACKLIST,
// 	ETH: ETH_TOKEN_BLACKLIST,
// 	POLYGON_ZKEVM: ['0x'],
// }

// export const multiChainTokenWhiteList: Record<MultiChainName, string[]> = {
// 	BSC: BSC_TOKEN_WHITELIST,
// 	ETH: ETH_TOKEN_WHITELIST,
// 	POLYGON_ZKEVM: [],
// }

// export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainNameExtend): GraphQLClient => {
// 	const isStableSwap = checkIsStableSwap()
// 	if (isStableSwap) return infoStableSwapClient
// 	return multiChainQueryClient[chainName]
// }

export const subgraphTokenName = {
	'0x738d96caf7096659db4c1afbf1e1bdfd281f388c': 'Ankr Staked MATIC',
	'0x14016e85a25aeb13065688cafb43044c2ef86784': 'True USD Old',
}

export const subgraphTokenSymbol = {
	'0x14016e85a25aeb13065688cafb43044c2ef86784': 'TUSDOLD',
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
