import { Icon, IconEnum, Tag } from '@astraprotocol/astra-ui'
import { useTranslation } from 'contexts/Localization'
import { useTooltip } from 'hooks/useTooltip'
import { memo } from 'react'

const CoreTag = props => {
	const { t } = useTranslation()
	return (
		<Tag scale="xs" variant="primary" outline {...props}>
			<Icon icon={IconEnum.ICON_CHECKED} classes="link-color-useful margin-right-2xs" />
			{t('Core')}
		</Tag>
	)
}

// eslint-disable-next-line react/display-name
const FarmAuctionTagToolTipContent = memo(() => {
	const { t } = useTranslation()
	return (
		<span className="text" color="text">
			{t('Farm Auction Winner, add liquidity at your own risk.')}
		</span>
	)
})

const FarmAuctionTag = props => {
	const { t } = useTranslation()
	const { targetRef, tooltip, tooltipVisible } = useTooltip(<FarmAuctionTagToolTipContent />, { placement: 'right' })
	return (
		<>
			{tooltipVisible && tooltip}
			<span ref={targetRef} style={{ textDecoration: 'none' }}>
				<Tag
					variant="failure"
					outline
					// startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />}
					{...props}
				>
					{t('Farm Auction')}
				</Tag>
			</span>
		</>
	)
}

const CommunityTag = props => {
	const { t } = useTranslation()
	return (
		<Tag
			variant="error"
			outline
			// startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />}
			{...props}
		>
			{t('Community')}
		</Tag>
	)
}

const DualTag = props => {
	const { t } = useTranslation()
	return (
		<Tag variant="info" outline {...props}>
			{t('Dual')}
		</Tag>
	)
}

const ManualPoolTag = props => {
	const { t } = useTranslation()
	return (
		<Tag
			variant="info"
			outline
			// startIcon={<RefreshIcon width="18px" color="secondary" mr="4px" />}
			{...props}
		>
			{t('Manual')}
		</Tag>
	)
}

const CompoundingPoolTag = props => {
	const { t } = useTranslation()
	return (
		<Tag
			variant="success"
			outline
			// startIcon={<AutoRenewIcon width="18px" color="success" mr="4px" />}
			{...props}
		>
			{t('Auto')}
		</Tag>
	)
}

const VoteNowTag = props => {
	const { t } = useTranslation()
	return (
		<Tag
			variant="success"
			// startIcon={<VoteIcon width="18px" color="success" mr="4px" />}
			{...props}
		>
			{t('Vote Now')}
		</Tag>
	)
}

const SoonTag = props => {
	const { t } = useTranslation()
	return (
		<Tag
			variant="primary"
			// startIcon={<TimerIcon width="18px" color="success" mr="4px" />}
			{...props}
		>
			{t('Soon')}
		</Tag>
	)
}

const ClosedTag = props => {
	const { t } = useTranslation()
	return (
		<Tag
			variant="warning"
			// startIcon={<BlockIcon width="18px" color="textDisabled" mr="4px" />}
			{...props}
		>
			{t('Closed')}
		</Tag>
	)
}

export {
	CoreTag,
	FarmAuctionTag,
	DualTag,
	ManualPoolTag,
	CompoundingPoolTag,
	VoteNowTag,
	SoonTag,
	ClosedTag,
	CommunityTag,
}
