import { IconButton, IconEnum, NormalButton } from '@astraprotocol/astra-ui'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
// import { TradingViewLabel } from 'components/TradingView'
import { useTranslation } from 'contexts/Localization'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import { ChartViewMode } from 'state/user/actions'
import { useExchangeChartViewManager } from 'state/user/hooks'
import BasicChart from './BasicChart'
import StyledPriceChart from './StyledPriceChart'

const PriceChart = ({
	inputCurrency,
	outputCurrency,
	onSwitchTokens,
	isChartExpanded,
	setIsChartExpanded,
	isMobile,
	isFullWidthContainer,
	token0Address,
	token1Address,
	currentSwapPrice,
}) => {
	const { isDesktop } = useMatchBreakpoints()
	const toggleExpanded = () => setIsChartExpanded(currentIsExpanded => !currentIsExpanded)
	const [chartView, setChartView] = useExchangeChartViewManager()
	// const [twChartSymbol, setTwChartSymbol] = useState('')
	const { t } = useTranslation()

	// const handleTwChartSymbol = useCallback((symbol) => {
	//   setTwChartSymbol(symbol)
	// }, [])

	return (
		<StyledPriceChart
			style={{
				// height: isMobile ? '100%' : '70%',
				height: isMobile ? '100%' : 'auto',
				overflow: 'unset',
			}}
			isExpanded={isChartExpanded}
			isFullWidthContainer={isFullWidthContainer}
		>
			<div className="flex flex-justify-space-between">
				<div className="flex flex-align-center">
					{outputCurrency ? (
						<DoubleCurrencyLogo currency0={inputCurrency} currency1={outputCurrency} size={24} margin />
					) : (
						inputCurrency && (
							<CurrencyLogo currency={inputCurrency} size={24} style={{ marginRight: '8px' }} />
						)
					)}
					{inputCurrency && (
						<span className="text text-base text-bold">
							{outputCurrency ? `${inputCurrency.symbol}/${outputCurrency.symbol}` : inputCurrency.symbol}
						</span>
					)}
					<IconButton classes="padding-sm " icon={IconEnum.ICON_SWAP_LEFT_RIGHT} onClick={onSwitchTokens} />
					<div>
						{/* <NormalButton title={t('Basic')} onClick={() => setChartView(ChartViewMode.BASIC)}>
							{t('Basic')}
						</NormalButton> */}
						{/* <ChartButton
						aria-label="TradingView"
						title="TradingView"
						$active={chartView === ChartViewMode.TRADING_VIEW}
						scale="sm"
						variant="text"
						onClick={() => setChartView(ChartViewMode.TRADING_VIEW)}
						>
						{isDesktop ? 'TradingView' : <TradingViewIcon color="primary" />}
						</ChartButton> */}
					</div>
				</div>
				{/* {!isMobile && (
					<div className='flex'>
						<IconButton  onClick={toggleExpanded}>
							{isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="text" />}
						</IconButton>
					</div>
				)} */}
			</div>
			<BasicChart
				token0Address={token0Address}
				token1Address={token1Address}
				isChartExpanded={isChartExpanded}
				inputCurrency={inputCurrency}
				outputCurrency={outputCurrency}
				isMobile={isMobile}
				currentSwapPrice={currentSwapPrice}
			/>
		</StyledPriceChart>
	)
}

export default PriceChart
