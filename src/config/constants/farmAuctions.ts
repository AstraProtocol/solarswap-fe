import { ChainId } from '@solarswap/sdk'
import getLpAddress from 'utils/getLpAddress'
import { CHAIN_ID } from './networks'
import tokens from './tokens'
import { FarmAuctionBidderConfig } from './types'

/**
 * @todo add token later
 */
export const whitelistedBidders: FarmAuctionBidderConfig[] =
	Number(CHAIN_ID) === ChainId.MAINNET
		? [
				// {
				// 	account: '0x9Ed5a62535A5Dd2dB2d9bB21bAc42035Af47F630',
				// 	farmName: 'NAV-BNB',
				// 	tokenAddress: '0xBFEf6cCFC830D3BaCA4F6766a0d4AaA242Ca9F3D',
				// 	quoteToken: tokens.wbnb,
				// 	tokenName: 'Navcoin',
				// 	projectSite: 'https://navcoin.org/en'
				// },
		  ].map(bidderConfig => ({
				...bidderConfig,
				lpAddress: getLpAddress(bidderConfig.tokenAddress, bidderConfig.quoteToken),
		  }))
		: []

const UNKNOWN_BIDDER: FarmAuctionBidderConfig = {
	account: '',
	tokenAddress: '',
	quoteToken: tokens.wasa,
	farmName: 'Unknown',
	tokenName: 'Unknown',
}

export const getBidderInfo = (account: string): FarmAuctionBidderConfig => {
	const matchingBidder = whitelistedBidders.find(bidder => bidder.account.toLowerCase() === account.toLowerCase())
	if (matchingBidder) {
		return matchingBidder
	}
	return { ...UNKNOWN_BIDDER, account }
}
