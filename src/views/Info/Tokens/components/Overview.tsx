import { NormalButton, Row } from '@astraprotocol/astra-ui'
import { Token } from '@solarswap/sdk'
import clsx from 'clsx'
import { CurrencyLogo } from 'components/Logo'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { CHAIN_ID } from 'config/constants/networks'
import { useTranslation } from 'contexts/Localization'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import { subgraphTokenName, subgraphTokenSymbol } from 'state/info/constant'
import { formatAmount } from 'utils/formatInfoNumbers'
import Percent from 'views/Info/components/Percent'
import style from '../style.module.scss'
import Card from 'components/Card'
import ChartCard from 'views/Info/components/InfoCharts/ChartCard'
import { useTokenChartDataSWR, useTokenPriceDataSWR } from 'state/info/hooks'
import { useMemo } from 'react'
import { ONE_HOUR_SECONDS } from 'config/constants/info'

const DEFAULT_TIME_WINDOW: Duration = { weeks: 1 }

const TokenInfoOverview = ({ tokenData, address }) => {
	const chartData = useTokenChartDataSWR(address)
	const { t } = useTranslation()

	// pricing data
	const priceData = useTokenPriceDataSWR(address, ONE_HOUR_SECONDS, DEFAULT_TIME_WINDOW)
	const adjustedPriceData = useMemo(() => {
		// Include latest available price
		if (priceData && tokenData && priceData.length > 0) {
			return [
				...priceData,
				{
					time: Date.now() / 1000,
					open: priceData[priceData.length - 1].close,
					close: tokenData?.priceUSD,
					high: tokenData?.priceUSD,
					low: priceData[priceData.length - 1].close,
				},
			]
		}
		return undefined
	}, [priceData, tokenData])
	return (
		<div className={style.contentLayout}>
			<Card className="padding-lg">
				<span className="text text-sm text-bold secondary-color-normal text-uppercase">{t('Liquidity')}</span>
				<br />
				<span className="money money-md money-bold">${formatAmount(tokenData.liquidityUSD)}</span>
				<br />
				<Percent value={tokenData.liquidityUSDChange} />

				<div className="margin-top-xs text text-sm text-bold secondary-color-normal text-uppercase">
					{t('Volume 24H')}
				</div>
				{/* <br /> */}
				<span className="money money-md money-bold money-uppercase">${formatAmount(tokenData.volumeUSD)}</span>
				<br />
				<Percent value={tokenData.volumeUSDChange} />

				<div className="margin-top-md text text-bold text-sm text-bold text-uppercase secondary-color-normal">
					{t('Volume 7D')}
				</div>
				{/* <br /> */}
				<span className="money money-md money-bold">${formatAmount(tokenData.volumeUSDWeek)}</span>

				<div className="margin-top-md text text-sm text-bold secondary-color-normal text-uppercase">
					{t('Transactions 24H')}
				</div>
				{/* <br /> */}
				<span className="money money-md money-bold">
					{formatAmount(tokenData.txCount, { isInteger: true })}
				</span>
			</Card>
			{/* charts card */}
			<ChartCard variant="token" chartData={chartData} tokenData={tokenData} tokenPriceData={adjustedPriceData} />
		</div>
	)
}

export default TokenInfoOverview
