import { ContractFunction } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'

export type MultiCallResponse<T> = T | null

// Farm Auction

// Note: slightly different from AuctionStatus used throughout UI
export enum FarmAuctionContractStatus {
	Pending,
	Open,
	Close,
}

export interface AuctionsResponse {
	status: FarmAuctionContractStatus
	startBlock: BigNumber
	endBlock: BigNumber
	initialBidAmount: BigNumber
	leaderboard: BigNumber
	leaderboardThreshold: BigNumber
}

export interface BidsPerAuction {
	account: string
	amount: BigNumber
}

type GetWhitelistedAddressesResponse = [
	{
		account: string
		lpToken: string
		token: string
	}[],
	BigNumber,
]
