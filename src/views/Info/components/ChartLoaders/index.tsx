import { useTranslation } from 'contexts/Localization'
import LineChartLoaderSVG from './LineChartLoaderSVG'
import BarChartLoaderSVG from './BarChartLoaderSVG'
import CandleChartLoaderSVG from './CandleChartLoaderSVG'
import styles from './styles.module.scss'

const LoadingText = ({ children }) => <div className={styles.loadingText}>{children}</div>
const LoadingIndicator = ({ children }) => <div className={styles.loadingIndicator}>{children}</div>

export const BarChartLoader: React.FC = () => {
	const { t } = useTranslation()
	return (
		<LoadingIndicator>
			<BarChartLoaderSVG />
			<LoadingText>
				<span className="text text-base">{t('Loading chart data...')}</span>
			</LoadingText>
		</LoadingIndicator>
	)
}

export const LineChartLoader: React.FC = () => {
	const { t } = useTranslation()
	return (
		<LoadingIndicator>
			<LineChartLoaderSVG />
			<LoadingText>
				<span className="text text-base">{t('Loading chart data...')}</span>
			</LoadingText>
		</LoadingIndicator>
	)
}

export const CandleChartLoader: React.FC = () => {
	const { t } = useTranslation()
	return (
		<LoadingIndicator>
			<CandleChartLoaderSVG />
			<LoadingText>
				<span className="text text-base">{t('Loading chart data...')}</span>
			</LoadingText>
		</LoadingIndicator>
	)
}
