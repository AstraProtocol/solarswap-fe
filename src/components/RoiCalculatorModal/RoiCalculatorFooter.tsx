import { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { getApy } from 'utils/compoundApyHelpers'
import { Icon, IconEnum, NormalButton, Row, Typography } from '@astraprotocol/astra-ui'
import styles from './styles.module.scss'
import { useTooltip } from 'hooks/useTooltip'
import clsx from 'clsx'

interface RoiCalculatorFooterProps {
	isFarm: boolean
	apr: number
	displayApr: string
	autoCompoundFrequency: number
	multiplier: string
	linkLabel: string
	linkHref: string
	performanceFee: number
}

const RoiCalculatorFooter: React.FC<RoiCalculatorFooterProps> = ({
	isFarm,
	apr,
	displayApr,
	autoCompoundFrequency,
	multiplier,
	linkLabel,
	linkHref,
	performanceFee
}) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const { t } = useTranslation()
	const {
		targetRef: multiplierRef,
		tooltip: multiplierTooltip,
		tooltipVisible: multiplierTooltipVisible
	} = useTooltip(
		<>
			<span className="text text-base">
				{t(
					'The Multiplier represents the proportion of ASA rewards each farm receives, as a proportion of the ASA produced each block.'
				)}
			</span>
			<span className="text text-base">
				{t('For example, if a 1x farm received 1 ASA per block, a 40x farm would receive 40 ASA per block.')}
			</span>
			<span className="text text-base">
				{t('This amount is already included in all APR calculations for the farm.')}
			</span>
		</>,
		{ placement: 'top-end', tooltipOffset: [20, 10] }
	)

	const gridRowCount = isFarm ? 4 : 2
	const apy = (getApy(apr, autoCompoundFrequency > 0 ? autoCompoundFrequency : 1, 365, performanceFee) * 100).toFixed(
		2
	)

	return (
		<div className="flex padding-md col width-100 padding-lg">
			<NormalButton variant="text" onClick={() => setIsExpanded(prev => !prev)}>
				<span className="text text-base secondary-color-normal">{isExpanded ? t('Hide') : t('Details')}</span>
				<Icon icon={isExpanded ? IconEnum.ICON_UP : IconEnum.ICON_DOWN} classes="secondary-color-normal" />
			</NormalButton>
			{isExpanded && (
				<div className={clsx(styles.roiCalculatorFooter, 'same-bg-color-30 padding-xs radius-lg')}>
					<div
						style={{
							gridTemplateColumns: '2.5fr 1fr',
							gridRowGap: 8,
							gridTemplateRows: `repeat(${gridRowCount}, auto)`
						}}
					>
						{isFarm && (
							<Row style={{ justifyContent: 'space-between' }}>
								<span className="text text-sm contrast-color-70">{t('APR (incl. LP rewards)')}</span>
								<span className="text text-sm text-right">{displayApr}%</span>
							</Row>
						)}
						<Row style={{ justifyContent: 'space-between' }}>
							<span className="text text-sm contrast-color-70">
								{isFarm ? t('Base APR (ASA yield only)') : t('APR')}
							</span>
							<span className="text text-sm text-right">{apr?.toFixed(2)}%</span>
						</Row>
						<Row style={{ justifyContent: 'space-between' }}>
							<span className="text text-sm contrast-color-70">
								{t('APY (%compoundTimes%x daily compound)', {
									compoundTimes: autoCompoundFrequency > 0 ? autoCompoundFrequency : 1
								})}
							</span>
							<span className="text text-sm text-right">{apy}%</span>
						</Row>
						{isFarm && (
							<Row style={{ justifyContent: 'space-between' }}>
								<span className="text text-sm contrast-color-70">{t('Farm Multiplier')}</span>
								<div className="flex flex-justify-end flex-align-end">
									<span className="text text-sm text-right margin-right-xs">{multiplier}</span>
									<span ref={multiplierRef}>
										<Icon icon={IconEnum.ICON_HELP} className="text-base" />
									</span>
									{multiplierTooltipVisible && multiplierTooltip}
								</div>
							</Row>
						)}
					</div>
					<div className={styles.bulletList}>
						<li className="contrast-color-70">
							<span className="text text-sm text-center contrast-color-70">
								{t('Calculated based on current rates.')}
							</span>
						</li>
						{isFarm && (
							<li className="contrast-color-70">
								<span className="text text-sm text-center contrast-color-70">
									{t(
										'LP rewards: 0.2% trading fees, distributed proportionally among LP token holders.'
									)}
								</span>
							</li>
						)}
						<li className="contrast-color-70">
							<span className="text text-sm text-center contrast-color-70">
								{t(
									'All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.'
								)}
							</span>
						</li>
						{performanceFee > 0 && (
							<li className="contrast-color-70">
								<span className="text text-sm margin-top-sm text-center contrast-color-70">
									{t('All estimated rates take into account this pool’s %fee%% performance fee', {
										fee: performanceFee
									})}
								</span>
							</li>
						)}
					</div>
					<div className="flex flex-justify-center margin-top-lg pointer">
						<Typography.Link target="_blank" href={linkHref}>
							{linkLabel}
							<Icon icon={IconEnum.ICON_EXTERNAL_LINK} classes="margin-left-xs link-color-useful" />
						</Typography.Link>
					</div>
				</div>
			)}
		</div>
	)
}

export default RoiCalculatorFooter
