import { useMemo, useState } from 'react'
import LineChart from 'views/Info/components/InfoCharts/LineChart'
import BarChart from 'views/Info/components/InfoCharts/BarChart'
import { formatAmount } from 'utils/formatInfoNumbers'
import { ChartEntry, TokenData, PriceChartEntry } from 'state/info/types'
import { fromUnixTime } from 'date-fns'
import dynamic from 'next/dynamic'
import Skeleton from 'react-loading-skeleton'
import { useTranslation } from 'contexts/Localization'
import Card from 'components/Card'
import { ButtonMenu, ButtonMenuItem } from '@astraprotocol/astra-ui'
import clsx from 'clsx'
import styles from './style.module.scss'

const CandleChart = dynamic(() => import('../CandleChart'), {
	ssr: false,
})

enum ChartView {
	LIQUIDITY,
	VOLUME,
	PRICE,
}

interface ChartCardProps {
	variant: 'pool' | 'token'
	chartData: ChartEntry[]
	tokenData?: TokenData
	tokenPriceData?: PriceChartEntry[]
}

const ChartCard: React.FC<React.PropsWithChildren<ChartCardProps>> = ({
	variant,
	chartData,
	tokenData,
	tokenPriceData,
}) => {
	const [view, setView] = useState(variant === 'token' ? ChartView.PRICE : ChartView.VOLUME)
	const [hoverValue, setHoverValue] = useState<number | undefined>()
	const [hoverDate, setHoverDate] = useState<string | undefined>()
	const {
		t,
		currentLanguage: { locale },
	} = useTranslation()

	const currentDate = new Date().toLocaleString(locale, { month: 'short', year: 'numeric', day: 'numeric' })

	const formattedTvlData = useMemo(() => {
		if (chartData) {
			return chartData.map(day => {
				return {
					time: fromUnixTime(day.date),
					value: day.liquidityUSD,
				}
			})
		}
		return []
	}, [chartData])
	const formattedVolumeData = useMemo(() => {
		if (chartData) {
			return chartData.map(day => {
				return {
					time: fromUnixTime(day.date),
					value: day.volumeUSD,
				}
			})
		}
		return []
	}, [chartData])

	const getLatestValueDisplay = () => {
		let valueToDisplay = null
		if (hoverValue) {
			valueToDisplay = formatAmount(hoverValue)
		} else if (view === ChartView.VOLUME && formattedVolumeData.length > 0) {
			valueToDisplay = formatAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
		} else if (view === ChartView.LIQUIDITY && formattedTvlData.length > 0) {
			valueToDisplay = formatAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
		} else if ((view === ChartView.PRICE && tokenData?.priceUSD) || tokenData?.priceUSD === 0) {
			valueToDisplay = formatAmount(tokenData.priceUSD, { notation: 'standard' })
		}

		return valueToDisplay ? (
			<span className="text text-xl text-bold">${valueToDisplay}</span>
		) : (
			<Skeleton height="36px" width="128px" />
		)
	}

	return (
		<Card>
			<ButtonMenu
				className={clsx(styles.buttonMenu)}
				activeIndex={view}
				onItemClick={value => setView(value)}
				size="sm"
			>
				<ButtonMenuItem variant="tertiary">
					<b>{t('Volume')}</b>
				</ButtonMenuItem>
				<ButtonMenuItem variant="tertiary">
					<b>{t('Liquidity')}</b>
				</ButtonMenuItem>
				{variant === 'token' ? (
					<ButtonMenuItem variant="tertiary">
						<b>{t('Price')}</b>
					</ButtonMenuItem>
				) : (
					<div />
				)}
			</ButtonMenu>
			<div className="padding-top-md">
				{getLatestValueDisplay()}
				<br />
				<span className="text text-sm text-bold secondary-color-normal">{hoverDate || currentDate}</span>
			</div>

			<div style={{ height: variant === 'token' ? '250px' : '335px' }}>
				{view === ChartView.LIQUIDITY ? (
					<LineChart data={formattedTvlData} setHoverValue={setHoverValue} setHoverDate={setHoverDate} />
				) : view === ChartView.VOLUME ? (
					<BarChart data={formattedVolumeData} setHoverValue={setHoverValue} setHoverDate={setHoverDate} />
				) : view === ChartView.PRICE ? (
					<CandleChart data={tokenPriceData} setValue={setHoverValue} setLabel={setHoverDate} />
				) : null}
			</div>
		</Card>
	)
}

export default ChartCard
