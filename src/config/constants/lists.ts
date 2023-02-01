const SOLAR_EXTENDED = `https://tokens.${process.env.DOMAIN}/solarswap-extended.json`
const SOLAR_TOP100 = `https://tokens.${process.env.DOMAIN}/solarswap-top-100.json`
const COINGECKO = `https://tokens.${process.env.DOMAIN}/coingecko.json`

// List of official tokens list
export const OFFICIAL_LISTS = [] // [SOLAR_EXTENDED, SOLAR_TOP100]

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
	// COINGECKO,
	// SOLAR_TOP100,
	// SOLAR_EXTENDED,
	...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
