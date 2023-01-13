import { Tag } from '@astraprotocol/astra-ui'
import { Token } from '@solarswap/sdk'
import { CoreTag, FarmAuctionTag } from 'components/Tags'
import { TokenPairImage } from 'components/TokenImage'

import Skeleton from 'react-loading-skeleton'

export interface ExpandableSectionProps {
	lpLabel?: string
	multiplier?: string
	isCommunityFarm?: boolean
	token: Token
	quoteToken: Token
}

// const Wrappers

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, multiplier, isCommunityFarm, token, quoteToken }) => {
	return (
		<div className="flex flex-justify-space-between flex-align-center margin-bottom-sm">
			<TokenPairImage
				variant="inverted"
				primaryToken={token}
				secondaryToken={quoteToken}
				width={64}
				height={64}
			/>
			<div className="flex col flex-align-end">
				<span className="text text-2xl">{lpLabel.split(' ')[0]}</span>
				<div className="flex flex-justify-center">
					{isCommunityFarm ? <FarmAuctionTag /> : <CoreTag />}
					{multiplier ? <Tag className="margin-left-xs">{multiplier}</Tag> : <Skeleton />}
				</div>
			</div>
		</div>
	)
}

export default CardHeading
