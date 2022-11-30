import { BigNumber } from '@ethersproject/bignumber'
import { Campaign, TranslatableText } from 'config/constants/types'

import { campaignMap } from 'config/constants/campaigns'
import { Achievement } from 'state/types'
import { multicallv2 } from 'utils/multicall'
import { getPointCenterIfoAddress } from 'utils/addressHelpers'
import pointCenterIfoABI from 'config/abi/pointCenterIfo.json'

interface IfoMapResponse {
	thresholdToClaim: string
	campaignId: string
	numberPoints: BigNumber
}

export const getAchievementTitle = (campaign: Campaign): TranslatableText => {
	switch (campaign.type) {
		case 'ifo':
			return {
				key: 'IFO Shopper: %title%',
				data: {
					title: campaign.title as string
				}
			}
		default:
			return campaign.title
	}
}

export const getAchievementDescription = (campaign: Campaign): TranslatableText => {
	switch (campaign.type) {
		case 'ifo':
			return {
				key: 'Committed more than $5 worth of LP in the %title% IFO',
				data: {
					title: campaign.title as string
				}
			}
		default:
			return campaign.description
	}
}
