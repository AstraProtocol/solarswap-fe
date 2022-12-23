// import {
// 	Button,
// 	ExpandIcon,
// 	Flex,
// 	IconButton,
// 	ShrinkIcon,
// 	SyncAltIcon,
// 	span,
// 	// TradingViewIcon,
// 	LineGraphIcon,
// 	useMatchBreakpoints
// } from '@solarswap/uikit'
import { IconButton, IconEnum, NormalButton } from '@astraprotocol/astra-ui'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
// import { TradingViewLabel } from 'components/TradingView'
import { useTranslation } from 'contexts/Localization'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import { ChartViewMode } from 'state/user/actions'
import { useExchangeChartViewManager } from 'state/user/hooks'
// import styled from 'styled-components'
import BasicChart from './BasicChart'
import StyledPriceChart from './StyledPriceChart'
// import { StyledPriceChart } from './styles'
// import TradingViewChart from './TradingViewChart'
// import PairPriceDisplay from '../../../../components/PairPriceDisplay'

// const ChartButton = styled(Button)`
// 	background-color: ${({ $active, theme }) => $active && `${theme.colors.primary}0f`};
// 	padding: 4px 8px;
// 	border-radius: 6px;
// `

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
	currentSwapPrice
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
				height: '70%',
				overflow: 'unset'
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
							<CurrencyLogo currency={inputCurrency} size="24px" style={{ marginRight: '8px' }} />
						)
					)}
					{inputCurrency && (
						<span className="text text-base text-bold">
							{outputCurrency ? `${inputCurrency.symbol}/${outputCurrency.symbol}` : inputCurrency.symbol}
						</span>
					)}
					<IconButton classes="padding-sm" icon={IconEnum.ICON_SWAP_LEFT_RIGHT} onClick={onSwitchTokens} />
					<div>
						<NormalButton
							title={t('Basic')}
							// $active={chartView === ChartViewMode.BASIC}
							onClick={() => setChartView(ChartViewMode.BASIC)}
						>
							{/* {isDesktop ? t('Basic') : <LineGraphIcon color="primary" />} */}
							{t('Basic')}
						</NormalButton>
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
					<Flex>
						<IconButton variant="text" onClick={toggleExpanded}>
							{isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="text" />}
						</IconButton>
					</Flex>
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
