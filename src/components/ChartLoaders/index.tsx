import LineChartLoaderSVG from './LineChartLoaderSVG'
import BarChartLoaderSVG from './BarChartLoaderSVG'
import CandleChartLoaderSVG from './CandleChartLoaderSVG'
import { useTranslation } from 'contexts/Localization'
import styles from './style.module.scss'
import { cloneElement } from 'react'
import { isArray } from 'lodash'

const LoadingText = props => (
	<div className={styles.loadingText}>
		{isArray(props.children) ? props.children.map((c, index) => cloneElement(c, { key: index })) : props.children}
	</div>
)
const LoadingIndicator = props => (
	<div className={styles.loadingIndicator}>
		{isArray(props.children) ? props.children.map((c, index) => cloneElement(c, { key: index })) : props.children}
	</div>
)

export const BarChartLoader: React.FC<React.PropsWithChildren> = () => {
	const { t } = useTranslation()
	return (
		<LoadingIndicator>
			<BarChartLoaderSVG />
			<LoadingText>
				<span className="text text-md text-bold">{t('Loading chart data...')}</span>
			</LoadingText>
		</LoadingIndicator>
	)
}

export const LineChartLoader: React.FC<React.PropsWithChildren> = () => {
	const { t } = useTranslation()
	return (
		<LoadingIndicator>
			<LineChartLoaderSVG />
			<LoadingText>
				<span className="text text-md text-bold">{t('Loading chart data...')}</span>
			</LoadingText>
		</LoadingIndicator>
	)
}

export const CandleChartLoader: React.FC<React.PropsWithChildren> = () => {
	const { t } = useTranslation()
	return (
		<LoadingIndicator>
			<CandleChartLoaderSVG />
			<LoadingText>
				<span className="text text-md text-bold">{t('Loading chart data...')}</span>
			</LoadingText>
		</LoadingIndicator>
	)
}
