import { fromUnixTime } from 'date-fns'
import { useState, useMemo, memo, useEffect } from 'react'
import { ChartEntry, ProtocolData } from 'state/info/types'
import { formatAmount } from 'utils/formatInfoNumbers'
import BarChart from './BarChart'
import LineChart from './LineChart'
import Skeleton from 'react-loading-skeleton'

interface HoverableChartProps {
	chartData: ChartEntry[]
	protocolData: ProtocolData
	currentDate: string
	valueProperty: string
	title: string
	ChartComponent: typeof BarChart | typeof LineChart
}

const HoverableChart = ({
	chartData,
	protocolData,
	currentDate,
	valueProperty,
	title,
	ChartComponent,
}: HoverableChartProps) => {
	const [hover, setHover] = useState<number | undefined>()
	const [dateHover, setDateHover] = useState<string | undefined>()

	// Getting latest data to display on top of chart when not hovered
	useEffect(() => {
		setHover(null)
	}, [protocolData])

	useEffect(() => {
		if (hover == null && protocolData) {
			setHover(protocolData[valueProperty])
		}
	}, [protocolData, hover, valueProperty])

	const formattedData = useMemo(() => {
		if (chartData) {
			return chartData.map(day => {
				return {
					time: fromUnixTime(day.date),
					value: day[valueProperty],
				}
			})
		}
		return []
	}, [chartData, valueProperty])

	return (
		<div className="col padding-top-md padding-right-md padding-bottom-lg">
			<span className="text text-base text-bold secondary-color-normal">{title}</span>
			{hover > -1 ? ( // sometimes data is 0
				<span className="money money-md money-bold">${formatAmount(hover)}</span>
			) : (
				<Skeleton width="128px" height="36px" />
			)}
			<span className="text text-base">{dateHover ?? currentDate}</span>
			<div style={{ height: 250 }}>
				<ChartComponent data={formattedData} setHoverValue={setHover} setHoverDate={setDateHover} />
			</div>
		</div>
	)
}

export default memo(HoverableChart)
