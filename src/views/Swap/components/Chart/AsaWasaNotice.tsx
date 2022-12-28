import { useTranslation } from 'contexts/Localization'
import StyledPriceChart from './StyledPriceChart'

interface AsaWasaNoticeProps {
	isChartExpanded: boolean
}

const AsaWasaNotice: React.FC<AsaWasaNoticeProps> = ({ isChartExpanded }) => {
	const { t } = useTranslation()
	return (
		<StyledPriceChart isExpanded={isChartExpanded}>
			<div className="flex flex-ver-center">
				<span className="text text-base text-center">
					{t('You can swap WASA for ASA (and vice versa) with no trading fees.')}
				</span>
				<span className="text text-base text-center">{t('Exchange rate is always 1 to 1.')}</span>
			</div>
		</StyledPriceChart>
	)
}

export default AsaWasaNotice
