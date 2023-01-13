import { useTranslation } from 'contexts/Localization'
import { useState, memo } from 'react'
import { useFetchPairPrices } from 'state/swap/hooks'
import dynamic from 'next/dynamic'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import NoChartAvailable from './NoChartAvailable'
import PairPriceDisplay from '../../../../components/PairPriceDisplay'
import { getTimeWindowChange } from './utils'
import { ButtonMenu, ButtonMenuItem, useMobileLayout } from '@astraprotocol/astra-ui'
import clsx from 'clsx'

const SwapLineChart = dynamic(() => import('./SwapLineChart'), {
	ssr: false
})

const BasicChart = ({
	token0Address,
	token1Address,
	isChartExpanded,
	inputCurrency,
	outputCurrency,
	isMobile,
	currentSwapPrice
}) => {
	const [timeWindow, setTimeWindow] = useState<PairDataTimeWindowEnum>(0)

	const { pairPrices = [], pairId } = useFetchPairPrices({
		token0Address,
		token1Address,
		timeWindow,
		currentSwapPrice
	})
	const [hoverValue, setHoverValue] = useState<number | undefined>()
	const [hoverDate, setHoverDate] = useState<string | undefined>()
	const valueToDisplay = hoverValue || pairPrices[pairPrices.length - 1]?.value
	const { changePercentage, changeValue } = getTimeWindowChange(pairPrices)
	const isChangePositive = changeValue >= 0
	const chartHeight = isChartExpanded ? 'calc(100% - 120px)' : '378px'
	const {
		t,
		currentLanguage: { locale }
	} = useTranslation()
	const currentDate = new Date().toLocaleString(locale, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	})

	// Sometimes we might receive array full of zeros for obscure tokens while trying to derive data
	// In that case chart is not useful to users
	const isBadData =
		pairPrices &&
		pairPrices.length > 0 &&
		pairPrices.every(
			price => !price.value || price.value === 0 || price.value === Infinity || Number.isNaN(price.value)
		)

	if (isBadData) {
	return (
		<NoChartAvailable
			token0Address={token0Address}
			token1Address={token1Address}
			pairAddress={pairId}
			isMobile={isMobile}
		/>
	)
	}

	return (
		<>
			<div className={clsx('flex flex-justify-space-between', isMobile ? 'col' : 'row')}>
				<div className="flex col">
					<PairPriceDisplay
						value={pairPrices?.length > 0 && valueToDisplay}
						inputSymbol={inputCurrency?.symbol}
						outputSymbol={outputCurrency?.symbol}
					>
						<span color={isChangePositive ? 'success' : 'failure'} className="text text-base text-bold">
							{`${isChangePositive ? '+' : ''}${changeValue.toFixed(3)} (${changePercentage}%)`}
						</span>
					</PairPriceDisplay>
					<span className="text text-sm contrast-color-70">{hoverDate || currentDate}</span>
				</div>
				<div className="flex col">
					<ButtonMenu activeIndex={timeWindow} onItemClick={setTimeWindow}>
						<ButtonMenuItem>{t('24H')}</ButtonMenuItem>
						<ButtonMenuItem>{t('1W')}</ButtonMenuItem>
						<ButtonMenuItem>{t('1M')}</ButtonMenuItem>
						<ButtonMenuItem>{t('1Y')}</ButtonMenuItem>
					</ButtonMenu>
				</div>
			</div>
			<div style={{ height: isMobile ? '100%' : chartHeight, padding: isMobile ? '0px' : '16px', width: '100%' }}>
				<SwapLineChart
					data={pairPrices}
					setHoverValue={setHoverValue}
					setHoverDate={setHoverDate}
					isChangePositive={isChangePositive}
					timeWindow={timeWindow}
				/>
			</div>
		</>
	)
}

export default memo(BasicChart, (prev, next) => {
	return (
		prev.token0Address === next.token0Address &&
		prev.token1Address === next.token1Address &&
		prev.isChartExpanded === next.isChartExpanded &&
		prev.isMobile === next.isMobile &&
		prev.isChartExpanded === next.isChartExpanded &&
		((prev.currentSwapPrice !== null &&
			next.currentSwapPrice !== null &&
			prev.currentSwapPrice[prev.token0Address] === next.currentSwapPrice[next.token0Address] &&
			prev.currentSwapPrice[prev.token1Address] === next.currentSwapPrice[next.token1Address]) ||
			(prev.currentSwapPrice === null && next.currentSwapPrice === null))
	)
})
