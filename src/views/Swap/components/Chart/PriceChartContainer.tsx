import { Currency } from '@solarswap/sdk'
import { useCallback, useState } from 'react'
import AsaWasaNotice from './AsaWasaNotice'
import { WASA_ADDRESS } from './constants'
import PriceChart from './PriceChart'
import { getTokenAddress } from './utils'

type PriceChartContainerProps = {
	inputCurrencyId: string
	inputCurrency: Currency
	outputCurrencyId: string
	outputCurrency: Currency
	isChartExpanded: boolean
	setIsChartExpanded: React.Dispatch<React.SetStateAction<boolean>>
	isChartDisplayed: boolean
	currentSwapPrice: {
		[key: string]: number
	}
	isMobile?: boolean
	isFullWidthContainer?: boolean
}

const PriceChartContainer: React.FC<PriceChartContainerProps> = ({
	inputCurrencyId,
	inputCurrency,
	outputCurrency,
	outputCurrencyId,
	isChartExpanded,
	setIsChartExpanded,
	isChartDisplayed,
	isMobile,
	isFullWidthContainer = false,
	currentSwapPrice,
}) => {
	const token0Address = getTokenAddress(inputCurrencyId)
	const token1Address = getTokenAddress(outputCurrencyId)
	const [isPairReversed, setIsPairReversed] = useState(false)
	const togglePairReversed = useCallback(() => setIsPairReversed(prePairReversed => !prePairReversed), [])
	if (!isChartDisplayed) {
		return null
	}

	const isAsaWasa = token0Address === WASA_ADDRESS && token1Address === WASA_ADDRESS

	if (isAsaWasa) {
		return <AsaWasaNotice isChartExpanded={isChartExpanded} />
	}

	return (
		<PriceChart
			token0Address={isPairReversed ? token1Address : token0Address}
			token1Address={isPairReversed ? token0Address : token1Address}
			inputCurrency={isPairReversed ? outputCurrency : inputCurrency}
			outputCurrency={isPairReversed ? inputCurrency : outputCurrency}
			onSwitchTokens={togglePairReversed}
			isChartExpanded={isChartExpanded}
			setIsChartExpanded={setIsChartExpanded}
			isMobile={isMobile}
			isFullWidthContainer={isFullWidthContainer}
			currentSwapPrice={currentSwapPrice}
		/>
	)
}

export default PriceChartContainer
