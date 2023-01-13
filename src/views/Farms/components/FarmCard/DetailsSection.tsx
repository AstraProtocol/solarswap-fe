import { Icon, IconEnum, Typography } from '@astraprotocol/astra-ui'
import { useTranslation } from 'contexts/Localization'
import Skeleton from 'react-loading-skeleton'

export interface ExpandableSectionProps {
	bscScanAddress?: string
	infoAddress?: string
	removed?: boolean
	totalValueFormatted?: string
	lpLabel?: string
	addLiquidityUrl?: string
}

// const Wrapper = styled.div`
//   margin-top: 24px;
// `

// const StyledLinkExternal = styled(LinkExternal)`
//   font-weight: 400;
// `

const DetailsSection: React.FC<ExpandableSectionProps> = ({
	bscScanAddress,
	infoAddress,
	removed,
	totalValueFormatted,
	lpLabel,
	addLiquidityUrl
}) => {
	const { t } = useTranslation()

	return (
		<div className="margin-top-lg">
			<div className="flex flex-justify-space-between">
				<span className="text text-base">{t('Total Liquidity')}:</span>
				{totalValueFormatted ? (
					<span className="money money-sm">{totalValueFormatted}</span>
				) : (
					<Skeleton width={75} height={25} />
				)}
			</div>
			<div>
				{!removed && (
					<div>
						<Typography.Link target="_blank" href={addLiquidityUrl}>
							{t('Get %symbol%', { symbol: lpLabel })}
							<Icon icon={IconEnum.ICON_EXTERNAL_LINK} classes="margin-left-xs link-color-useful" />
						</Typography.Link>
					</div>
				)}
				<Typography.Link target="_blank" href={bscScanAddress}>
					{t('View Contract')}
					<Icon icon={IconEnum.ICON_EXTERNAL_LINK} classes="margin-left-xs link-color-useful" />
				</Typography.Link>
				<br />
				<Typography.Link target="_blank" href={infoAddress}>
					{t('See Pair Info')}
					<Icon icon={IconEnum.ICON_EXTERNAL_LINK} classes="margin-left-xs link-color-useful" />
				</Typography.Link>
			</div>
		</div>
	)
}

export default DetailsSection
