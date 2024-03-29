import { ChainId, JSBI, Percent, Token } from '@solarswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { mainnetTokens, testnetTokens } from './tokens'

export const ROUTER_ADDRESS = {
	[ChainId.MAINNET]: '0x7Dad3d655EA4BE30e1FD95adDbDeEdDcDAe0C2C6',
	[ChainId.TESTNET]: '0xfc9ecc743695f9BFfC8c33e5DB6e51356032Ef59',
}

export const ZAP_ADDRESS = {
	[ChainId.MAINNET]: '0xece9Ca24493c582E2F3a41912282C5ad16393F8c',
	[ChainId.TESTNET]: '0xE32e8e00Ba3D1A1D1dE0442d9879DFB636a98A87',
}

export const WASA_ADDRESS = {
	[ChainId.MAINNET]: '0x6637D8275DC58983Cb3A2fa64b705EC11f6EC670',
	[ChainId.TESTNET]: '0xA625BF1c3565775B1859B579DF980Fef324E7315',
}

// a list of tokens by chain
type ChainTokenList = {
	readonly [chainId in ChainId]: Token[]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
	[ChainId.MAINNET]: [mainnetTokens.wasa],
	[ChainId.TESTNET]: [testnetTokens.wasa, testnetTokens.usdt],
}

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: {
	[chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {
	[ChainId.TESTNET]: {},
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
 */
export const CUSTOM_BASES: {
	[chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {
	[ChainId.TESTNET]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
	[ChainId.MAINNET]: [mainnetTokens.usdt],
	[ChainId.TESTNET]: [testnetTokens.usdt],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
	[ChainId.MAINNET]: [mainnetTokens.wasa, mainnetTokens.usdt],
	[ChainId.TESTNET]: [testnetTokens.wasa, testnetTokens.usdt],
}

export const PINNED_PAIRS: {
	readonly [chainId in ChainId]?: [Token, Token][]
} = {
	[ChainId.TESTNET]: [[mainnetTokens.wasa, mainnetTokens.usdt]],
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

/**
 * @description used to ensure the user doesn't send so much ASA so they end up with <.01.
 * Make sure enough gas for the transaction.
 * @author tiendn
 * 02/12/2022
 * @todo verified exact number later
 */
export const MIN_ASA: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ASA
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = []

export { default as farmsConfig } from './farms'
// export { default as poolsConfig } from './pools'

export const FAST_INTERVAL = 10000
export const SLOW_INTERVAL = 60000

// Gelato uses this address to define a native currency in all chains
export const GELATO_NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
// Handler string is passed to Gelato to use PCS router
export const GELATO_HANDLER = 'pancakeswap'
export const GENERIC_GAS_LIMIT_ORDER_EXECUTION = BigNumber.from(500000)

export const EXCHANGE_DOCS_URLS = 'https://docs.solarswap.io/products/solarswap-exchange'
export const LIMIT_ORDERS_DOCS_URL = 'https://docs.solarswap.io/products/solarswap-exchange/limit-orders'

export enum ConnectorNames {
	Injected = 'injected',
	WalletConnect = 'walletconnect',
	BSC = 'bsc',
	Blocto = 'blocto',
	WalletLink = 'walletlink',
	AstraInjected = 'astrainjected',
	AstraConnect = 'astraconnect',
}
