export const MINIMUM_SEARCH_CHARACTERS = 2

export const WEEKS_IN_YEAR = 52.1429

export const TOTAL_FEE = parseInt(process.env.NEXT_PUBLIC_FEE) / 10000
export const LP_HOLDERS_FEE = TOTAL_FEE * 0.7
export const TREASURY_FEE = TOTAL_FEE * 0.3

/**
 * @todo update solarswap start_time below
 */
export const SS_START = 1673456400 // January 12, 2023 12:00:00 AM
export const ONE_DAY_UNIX = 86400 // 24h * 60m * 60s
export const ONE_HOUR_SECONDS = 3600

export const ITEMS_PER_INFO_TABLE_PAGE = 10

// These tokens are either incorrectly priced or have some other issues that spoil the query data
// None of them present any interest as they have almost 0 daily trade volume
export const TOKEN_BLACKLIST = []
