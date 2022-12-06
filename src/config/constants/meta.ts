/**
 * @fileoverview Tien 04/12/2022
 */
import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
	title: 'SolarSwap',
	description: 'Swap, earn and win ASTRA through yield farming on the first Defi exchange for Astra token.',
	image: `${process.env.NEXT_PUBLIC_HOST}/images/preview.png`
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
	let basePath
	if (path.startsWith('/swap')) {
		basePath = '/swap'
	} else if (path.startsWith('/add')) {
		basePath = '/add'
	} else if (path.startsWith('/remove')) {
		basePath = '/remove'
	} else if (path.startsWith('/teams')) {
		basePath = '/teams'
	} else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
		basePath = '/voting/proposal'
	} else if (path.startsWith('/nfts/collections')) {
		basePath = '/nfts/collections'
	} else if (path.startsWith('/nfts/profile')) {
		basePath = '/nfts/profile'
	} else if (path.startsWith('/solar-squad')) {
		basePath = '/solar-squad'
	} else {
		basePath = path
	}

	switch (basePath) {
		case '/':
			return {
				title: `${t('Home')} | ${t('SolarSwap')}`
			}
		case '/swap':
			return {
				title: `${t('Exchange')} | ${t('SolarSwap')}`
			}
		case '/add':
			return {
				title: `${t('Add Liquidity')} | ${t('SolarSwap')}`
			}
		case '/remove':
			return {
				title: `${t('Remove Liquidity')} | ${t('SolarSwap')}`
			}
		case '/liquidity':
			return {
				title: `${t('Liquidity')} | ${t('SolarSwap')}`
			}
		case '/find':
			return {
				title: `${t('Import Pool')} | ${t('SolarSwap')}`
			}
		case '/competition':
			return {
				title: `${t('Trading Battle')} | ${t('SolarSwap')}`
			}
		case '/prediction':
			return {
				title: `${t('Prediction')} | ${t('SolarSwap')}`
			}
		case '/prediction/leaderboard':
			return {
				title: `${t('Leaderboard')} | ${t('SolarSwap')}`
			}
		case '/farms':
			return {
				title: `${t('Farms')} | ${t('SolarSwap')}`
			}
		case '/farms/auction':
			return {
				title: `${t('Farm Auctions')} | ${t('SolarSwap')}`
			}
		case '/pools':
			return {
				title: `${t('Pools')} | ${t('SolarSwap')}`
			}
		case '/lottery':
			return {
				title: `${t('Lottery')} | ${t('SolarSwap')}`
			}
		case '/ifo':
			return {
				title: `${t('Initial Farm Offering')} | ${t('SolarSwap')}`
			}
		case '/teams':
			return {
				title: `${t('Leaderboard')} | ${t('SolarSwap')}`
			}
		case '/voting':
			return {
				title: `${t('Voting')} | ${t('SolarSwap')}`
			}
		case '/voting/proposal':
			return {
				title: `${t('Proposals')} | ${t('SolarSwap')}`
			}
		case '/voting/proposal/create':
			return {
				title: `${t('Make a Proposal')} | ${t('SolarSwap')}`
			}
		case '/info':
			return {
				title: `${t('Overview')} | ${t('SolarSwap Info & Analytics')}`,
				description: 'View statistics for Solarswap exchanges.'
			}
		case '/info/pools':
			return {
				title: `${t('Pools')} | ${t('SolarSwap Info & Analytics')}`,
				description: 'View statistics for Solarswap exchanges.'
			}
		case '/info/tokens':
			return {
				title: `${t('Tokens')} | ${t('SolarSwap Info & Analytics')}`,
				description: 'View statistics for Solarswap exchanges.'
			}
		case '/nfts':
			return {
				title: `${t('Overview')} | ${t('SolarSwap')}`
			}
		case '/nfts/collections':
			return {
				title: `${t('Collections')} | ${t('SolarSwap')}`
			}
		case '/nfts/activity':
			return {
				title: `${t('Activity')} | ${t('SolarSwap')}`
			}
		case '/nfts/profile':
			return {
				title: `${t('Profile')} | ${t('SolarSwap')}`
			}
		case '/solar-squad':
			return {
				title: `${t('Pancake Squad')} | ${t('SolarSwap')}`
			}
		default:
			return null
	}
}
