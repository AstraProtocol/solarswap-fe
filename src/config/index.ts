/**
 * @fileoverview Tien 04/12/2022
 */
import { ChainId } from '@solarswap/sdk'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { CHAIN_ID } from './constants/networks'

BigNumber.config({
	EXPONENTIAL_AT: 1000,
	DECIMAL_PLACES: 80
})

export const BSC_BLOCK_TIME = 2.5

export const BASE_ASTRA_EXPLORER_URLS = {
	[ChainId.MAINNET]: process.env.NEXT_PUBLIC_EXPLORER,
	[ChainId.TESTNET]: process.env.NEXT_PUBLIC_EXPLORER
}

// ASA_PER_BLOCK details
// 40 ASA is minted per block
// 20 ASA per block is sent to Burn pool (A farm just for burning cake)
// 10 ASA per block goes to ASA syrup pool
// 9 ASA per block goes to Yield farms and lottery
// ASA_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// @todo ASA_PER_BLOCK chua chot
export const ASA_PER_BLOCK = 2
export const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365 // 10512000
export const ASA_PER_YEAR = ASA_PER_BLOCK * BLOCKS_PER_YEAR
export const BASE_URL = process.env.NEXT_PUBLIC_HOST
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const BASE_ASTRA_EXPLORER_URL = BASE_ASTRA_EXPLORER_URLS[CHAIN_ID]
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 200000
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'

export const WALLET_CONNECT_RELAY = 'wc-relay.astranaut.dev'
