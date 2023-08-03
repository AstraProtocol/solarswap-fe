import { Token } from '@solarswap/sdk'

interface PairResponse {
	token0: {
		id: string
		symbol: string
	}
	token1: {
		id: string
		symbol: string
	}
}

export interface MintResponse {
	id: string
	timestamp: string
	pair: PairResponse
	to: string
	amount0: string
	amount1: string
	amountUSD: string
}

export interface SwapResponse {
	id: string
	timestamp: string
	pair: PairResponse
	from: string
	amount0In: string
	amount1In: string
	amount0Out: string
	amount1Out: string
	amountUSD: string
}

export interface BurnResponse {
	id: string
	timestamp: string
	pair: PairResponse
	sender: string
	amount0: string
	amount1: string
	amountUSD: string
}
export interface TokenDayData {
	date: number // UNIX timestamp in seconds
	dailyVolumeUSD: string
	totalLiquidityUSD: string
}

export interface TokenDayDatasResponse {
	tokenDayDatas: TokenDayData[]
}

// Footprint is the same, declared just for better readability
export type SolarDayData = TokenDayData

export interface SolarDayDatasResponse {
	solarDayDatas: SolarDayData[]
}

export interface PairDayData {
	date: number // UNIX timestamp in seconds
	dailyVolumeUSD: string
	reserveUSD: string
}

export interface PairDayDatasResponse {
	pairDayDatas: PairDayData[]
}

export interface Block {
	number: number
	timestamp: string
}

export type TokenData = {
	exists: boolean

	name: string
	symbol: string
	address: string
	decimals: number

	volumeUSD: number
	volumeUSDChange: number
	volumeUSDWeek: number
	txCount: number

	liquidityToken: number
	liquidityUSD: number
	liquidityUSDChange: number

	priceUSD: number
	priceUSDChange: number
	priceUSDChangeWeek: number

	campaignId?: string
	pairs?: ComputedFarmConfigV3[]
}

export type ComputedFarmConfigV3 = {
	pid: number
	lpSymbol: string
	lpAddress: `0x${string}`
	boosted?: boolean

	token: Token
	quoteToken: Token
	feeAmount: any // FeeAmount

	token0: Token
	token1: Token
	isCommunity?: boolean
}
