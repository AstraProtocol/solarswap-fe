import BigNumber from 'bignumber.js'
import Page from 'components/Layout/Page'
import { CHAIN_ID } from 'config/constants/networks'
import { useTranslation } from 'contexts/Localization'
import useInfoUserSavedTokensAndPools from 'hooks/useInfoUserSavedTokensAndPoolsList'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import { useTooltip } from 'hooks/useTooltip'
import { NextSeo } from 'next-seo'
import { useMemo, useState } from 'react'
import { checkIsStableSwap } from 'state/info/constant'
import { usePoolChartDataSWR, usePoolDatasSWR, usePoolTransactionsSWR, useStableSwapPath } from 'state/info/hooks'
// import styled from 'sufwmtyled-components'
import useSWRImmutable from 'swr/immutable'
import { getAstraExplorerLink } from 'utils'
import { formatAmount } from 'utils/formatInfoNumbers'
import ChartCard from 'views/Info/components/InfoCharts/ChartCard'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import Percent from 'views/Info/components/Percent'
import SaveIcon from 'views/Info/components/SaveIcon'
import style from './style.module.scss'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { ButtonMenu, ButtonMenuItem, Icon, IconEnum, NormalButton, Row, Typography } from '@astraprotocol/astra-ui'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import Heading from 'components/Heading'
import Spinner from 'components/Loader/Spinner'
import { Token } from '@solarswap/sdk'
import clsx from 'clsx'
import Card from 'components/Card'
import { isArray } from 'lodash'
// import farmsConfig from 'config/constants/farms'

// const ContentLayout = ({ children }) => <div className={style.contentLayout}>{children}</div>

// const TokenButton = ({ children }) => (
// 	<div className={style.tokenButton}>
// 		{isArray(children) ? children.map((child, index) => <div key={index}>{child}</div>) : children}
// 	</div>
// )

// const LockedTokensContainer = ({ children }) => <div className={style.lockedTokensContainer}>{children}</div>

// const getFarmConfig = async (chainId: number) => {
// 	const config = farmsConfig
// 	return config
// }

const PoolPage: React.FC<React.PropsWithChildren<{ address: string }>> = ({ address: routeAddress }) => {
	const { isXs, isSm } = useMatchBreakpoints()
	const { t } = useTranslation()
	const [showWeeklyData, setShowWeeklyData] = useState(0)
	const { tooltip, tooltipVisible, targetRef } = useTooltip(
		t(`Based on last 7 days' performance. Does not account for impermanent loss`),
		{},
	)

	// In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
	const address = routeAddress.toLowerCase()

	const poolData = usePoolDatasSWR(useMemo(() => [address], [address]))[0]
	const chartData = usePoolChartDataSWR(address)
	const transactions = usePoolTransactionsSWR(address)
	const { savedPools, addPool } = useInfoUserSavedTokensAndPools(parseInt(CHAIN_ID))

	const infoTypeParam = useStableSwapPath()
	const isStableSwap = checkIsStableSwap()
	const stableAPR = 0
	// const { data: farmConfig } = useSWRImmutable(isStableSwap && `info/gerFarmConfig/`, () =>
	// 	getFarmConfig(parseInt(CHAIN_ID)),
	// )

	const feeDisplay = useMemo(() => {
		// if (isStableSwap && farmConfig) {
		// 	const stableLpFee =
		// 		farmConfig?.find(d => d.stableSwapAddress?.toLowerCase() === address)?.stableLpFee ?? 0
		// 	return new BigNumber(stableLpFee)
		// 		.times(showWeeklyData ? poolData?.volumeOutUSDWeek : poolData?.volumeOutUSD)
		// 		.toNumber()
		// }
		return showWeeklyData ? poolData?.lpFees7d : poolData?.lpFees24h
	}, [poolData, showWeeklyData])
	const stableTotalFee = useMemo(
		() => (isStableSwap ? new BigNumber(feeDisplay).times(2).toNumber() : 0),
		[isStableSwap, feeDisplay],
	)

	const hasSmallDifference = useMemo(() => {
		return poolData ? Math.abs(poolData.token1Price - poolData.token0Price) < 1 : false
	}, [poolData])

	const token0 = useMemo(
		() => poolData?.token0?.address ? new Token(parseInt(CHAIN_ID), poolData?.token0?.address, 18, '') : '' as any,
		[poolData?.token0.address],
	)
	const token1 = useMemo(
		() => poolData?.token1?.address ? new Token(parseInt(CHAIN_ID), poolData?.token1?.address, 18, '') : '' as any,
		[poolData?.token1.address],
	)
	return (
		<Page>
			<NextSeo title={poolData ? `${poolData?.token0.symbol} / ${poolData?.token1.symbol}` : null} />
			{poolData ? (
				<>
					<Row className="flex-justify-space-between margin-bottom-md">
						<Breadcrumbs className="margin-bottom-lg">
							<NextLinkFromReactRouter to={`/info${infoTypeParam}`}>
								<span className="text text-base">{t('Info')}</span>
							</NextLinkFromReactRouter>
							<NextLinkFromReactRouter to={`/info/pairs${infoTypeParam}`}>
								<span className="text text-base">{t('Pairs')}</span>
							</NextLinkFromReactRouter>
							<Row>
								<span className="margin-right-xs text text-base">{`${poolData.token0.symbol} / ${poolData.token1.symbol}`}</span>
							</Row>
						</Breadcrumbs>
						<div>
							<Typography.Link target="_blank" href={getAstraExplorerLink(address, 'address')}>
								({t('View on AstraExplorer')})
							</Typography.Link>
						</div>
					</Row>
					<div>
						<Row className="flex-align-center margin-bottom-xs">
							<DoubleCurrencyLogo currency0={token0} currency1={token1} size={32} />
							<span
								className={clsx('margin-left-xs text text-bold text-2xl', {
									['text-lg']: isXs || isSm,
								})}
								id="info-pool-pair-title"
							>{`${poolData.token0.symbol} / ${poolData.token1.symbol}`}</span>
						</Row>
						<Row className="flex-justify-space-between">
							<div className="flex flex-align-center ">
								<NextLinkFromReactRouter
									to={`/info/tokens/${poolData.token0.address}${infoTypeParam}`}
									style={{ display: 'flex', justifyContent: 'center' }}
								>
									<CurrencyLogo currency={token0} size={24} />
									<span
										className="text text-base margin-left-2xs margin-right-sm font-600"
										style={{ whiteSpace: 'nowrap' }}
									>
										{`1 ${poolData.token0.symbol} =  ${formatAmount(poolData.token1Price, {
											notation: 'standard',
											displayThreshold: 0.001,
											tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
										})} ${poolData.token1.symbol}`}
									</span>
								</NextLinkFromReactRouter>
								<NextLinkFromReactRouter
									to={`/info/tokens/${poolData.token1.address}${infoTypeParam}`}
									style={{ display: 'flex', justifyContent: 'center' }}
								>
									<CurrencyLogo currency={token1} size={24} />
									<span
										className="text text-base margin-left-2xs font-600"
										style={{ whiteSpace: 'nowrap' }}
									>
										{`1 ${poolData.token1.symbol} =  ${formatAmount(poolData.token0Price, {
											notation: 'standard',
											displayThreshold: 0.001,
											tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
										})} ${poolData.token0.symbol}`}
									</span>
								</NextLinkFromReactRouter>
							</div>
							<div>
								<NextLinkFromReactRouter
									to={`/add/${poolData.token0.address}/${poolData.token1.address}`}
								>
									<NormalButton variant='default' classes={{ other: 'margin-right-xs text text-base text-bold' }}>
										{t('Add Liquidity')}
									</NormalButton>
								</NextLinkFromReactRouter>
								<NextLinkFromReactRouter
									to={`/swap?inputCurrency=${poolData.token0.address}&outputCurrency=${poolData.token1.address}`}
								>
									<NormalButton classes={{ other: 'text text-base text-bold' }}>
										{t('Trade')}
									</NormalButton>
								</NextLinkFromReactRouter>
							</div>
						</Row>
					</div>
					<div className={style.contentLayout}>
						<div>
							<Card>
								<Row className="flex-justify-space-between">
									<div>
										<span className="text text-bold secondary-color-theme text-xs text-uppercase">
											{t('Liquidity')}
										</span>
										<br />
										<span className="money money-bold money-md">
											${formatAmount(poolData.liquidityUSD)}
										</span>
										<br />
										<Percent value={poolData.liquidityUSDChange} />
									</div>
									<div>
										<span className="text text-xs text-bold secondary-color-theme text-uppercase">
											{t('LP reward APR')}
										</span>
										<br />
										<span className="text text-bold text-lg">
											{formatAmount(isStableSwap ? stableAPR : poolData.lpApr7d)}%
										</span>
										<br />
										<Row className="flex-align-center">
											<span className="text text-sm margin-right-2xs">{t('7D performance')}</span>
											<span ref={targetRef}>
												<Icon icon={IconEnum.ICON_HELP} />
											</span>
											{tooltipVisible && tooltip}
										</Row>
									</div>
								</Row>
								<br />
								<span className="text text-sm text-bold text-uppercase secondary-color-theme">
									{t('Total Tokens Locked')}
								</span>
								<div className={style.lockedTokenContainer}>
									<Row className="flex-justify-space-between">
										<Row>
											<CurrencyLogo currency={token0} size={24} />
											<span className="margin-left-xs text text-bold text-sm">
												{poolData.token0.symbol}
											</span>
										</Row>
										<span className="money money-xs">{formatAmount(poolData.liquidityToken0)}</span>
									</Row>
									<Row className="flex-justify-space-between margin-top-2xs">
										<Row>
											<CurrencyLogo currency={token1} size={24} />
											<span className="margin-left-xs text text-bold text-sm">
												{poolData.token1.symbol}
											</span>
										</Row>
										<span className="money money-xs">{formatAmount(poolData.liquidityToken1)}</span>
									</Row>
								</div>
							</Card>
							<Card className="margin-top-sm">
								<div className="padding-lg">
									<ButtonMenu
										activeIndex={showWeeklyData}
										onItemClick={index => setShowWeeklyData(index)}
										size="sm"
										className={clsx(style.buttonMenu)}
									>
										<ButtonMenuItem width="100%">{t('24H')}</ButtonMenuItem>
										<ButtonMenuItem width="100%">{t('7D')}</ButtonMenuItem>
									</ButtonMenu>
									<Row className="margin-top-lg">
										<div>
											<span className="text text-xs text-bold text-uppercase secondary-color-theme">
												{showWeeklyData ? t('Volume 7D') : t('Volume 24H')}
											</span>
											<br />
											<span className="money money-md money-bold">
												$
												{showWeeklyData
													? formatAmount(poolData.volumeUSDWeek)
													: formatAmount(poolData.volumeUSD)}
											</span>
											<br />
											<Percent
												value={
													showWeeklyData
														? poolData.volumeUSDChangeWeek
														: poolData.volumeUSDChange
												}
											/>
										</div>
										<div>
											<span className="secondary-color-theme text text-xs text-bold text-uppercase">
												{showWeeklyData ? t('LP reward fees 7D') : t('LP reward fees 24H')}
											</span>
											<br />
											<span className="money money-md money-bold">
												${formatAmount(feeDisplay)}
											</span>
											<br />
											<span color="textSubtle" className="text text-xs">
												{t('out of $%totalFees% total fees', {
													totalFees: isStableSwap
														? formatAmount(stableTotalFee)
														: showWeeklyData
														? formatAmount(poolData.totalFees7d)
														: formatAmount(poolData.totalFees24h),
												})}
											</span>
										</div>
									</Row>
								</div>
							</Card>
						</div>
						<ChartCard variant="pool" chartData={chartData} />
					</div>
					<Heading className="margin-bottom-md margin-top-2xl" scale="lg">
						{t('Transactions')}
					</Heading>
					<TransactionTable transactions={transactions} />
				</>
			) : (
				<Row style={{ marginTop: 80, justifyContent: 'center' }}>
					<Spinner />
				</Row>
			)}
		</Page>
	)
}

export default PoolPage
