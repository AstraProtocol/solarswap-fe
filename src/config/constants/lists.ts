const SOLAR_DEFAULT = 'https://tokens.solarswap.io/solarswap-default.json'
const SOLAR_EXTENDED = 'https://tokens.solarswap.io/solarswap-extended.json'
// const SOLAR_TOP100 = 'https://tokens.solarswap.io/solarswap-top-100.json'

// List of official tokens list
export const OFFICIAL_LISTS = [] // [SOLAR_EXTENDED, SOLAR_TOP100]

export const UNSUPPORTED_LIST_URLS: string[] = []
export const WARNING_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
	// SOLAR_TOP100,
	SOLAR_DEFAULT,
	SOLAR_EXTENDED,
	...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
	...WARNING_LIST_URLS,
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [SOLAR_EXTENDED]
