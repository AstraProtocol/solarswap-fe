import { useState } from 'react'
import { JSBI, Pair, Percent } from '@solarswap/sdk'
// import styled from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTotalSupply from '../../hooks/useTotalSupply'

import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'

import { LightCard } from '../Card'
import { AutoColumn } from '../Layout/Column'
import CurrencyLogo from '../Logo/CurrencyLogo'
import { DoubleCurrencyLogo } from '../Logo'
// import { RowBetween, Row } from 'components/Layout/Row'
import { Row, Icon, NormalButton, Container, IconEnum } from '@astraprotocol/astra-ui'
import { BIG_INT_ZERO } from '../../config/constants'
import Dots from '../Loader/Dots'
import Link from 'next/link'

// const Row = styled(RowBetween)`
// 	height: 24px;
// `

// interface PositionCardProps extends CardProps {
// 	pair: Pair
// 	showUnwrapped?: boolean
// }

export function MinimalPositionCard({ pair, showUnwrapped = false }) {
	const { account } = useActiveWeb3React()

	const { t } = useTranslation()

	const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
	const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

	const [showMore, setShowMore] = useState(false)

	const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
	const totalPoolTokens = useTotalSupply(pair.liquidityToken)

	const poolTokenPercentage =
		!!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
			? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
			: undefined

	const [token0Deposited, token1Deposited] =
		!!pair &&
		!!totalPoolTokens &&
		!!userPoolBalance &&
		// this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
		JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
			? [
					pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
					pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
			  ]
			: [undefined, undefined]

	return (
		<>
			{userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
				<div
					className="padding-md width-100 border border-base radius-lg margin-top-md margin-bottom-xl"
					style={{ maxWidth: 436 }}
				>
					<div className="flex col">
						<Row>
							<Row>
								<span
									className="text text-base text-bold margin-top-md margin-bottom-md"
									color="secondary"
								>
									{t('LP tokens in your wallet')}
								</span>
							</Row>
						</Row>
						<Row className="flex-justify-space-between" onClick={() => setShowMore(!showMore)}>
							<Row>
								<DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
								<span className="text text-sm margin-top-md margin-bottom-md" color="textSubtle">
									{currency0.symbol}-{currency1.symbol} LP
								</span>
							</Row>
							<div className="padding-right-2xs margin-top-md margin-bottom-md">
								<span className="text text-bold">
									{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
								</span>
							</div>
						</Row>
						<div className="flex col">
							<Row className="flex-justify-space-between padding-top-xs">
								<span className="text text-sm" color="textSubtle">
									{t('Share of Pool')}:
								</span>
								<div className="padding-right-2xs">
									<span className="text text-bold">
										{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}
									</span>
								</div>
							</Row>
							<Row className="margin-top-md margin-bottom-md flex-justify-space-between">
								<span className="text text-sm" color="textSubtle">
									{t('Pooled %asset%', { asset: currency0.symbol })}:
								</span>
								{token0Deposited ? (
									<div className="padding-right-2xs">
										<span className="text text-bold margin-left-xs">
											{token0Deposited?.toSignificant(6)}
										</span>
									</div>
								) : (
									'-'
								)}
							</Row>
							<Row className="margin-bottom-md flex-justify-space-between">
								<span className="text text-sm" color="textSubtle">
									{t('Pooled %asset%', { asset: currency1.symbol })}:
								</span>
								{token1Deposited ? (
									<div className="padding-right-2xs">
										<span className="text text-bold margin-left-xs">
											{token1Deposited?.toSignificant(6)}
										</span>
									</div>
								) : (
									'-'
								)}
							</Row>
						</div>
					</div>
				</div>
			) : (
				<div
					className="padding-md width-100 border border-base radius-lg margin-top-md margin-bottom-xl text-center"
					style={{ maxWidth: 436 }}
				>
					<span className="text text-sm">
						{t(
							"By adding liquidity you'll earn 0.2% of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.",
						)}
					</span>
				</div>
			)}
		</>
	)
}

export default function FullPositionCard({ pair, ...props }) {
	const { account } = useActiveWeb3React()

	const { t } = useTranslation()

	const currency0 = unwrappedToken(pair.token0)
	const currency1 = unwrappedToken(pair.token1)

	const [showMore, setShowMore] = useState(false)

	const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
	const totalPoolTokens = useTotalSupply(pair.liquidityToken)

	const poolTokenPercentage =
		!!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
			? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
			: undefined

	const [token0Deposited, token1Deposited] =
		!!pair &&
		!!totalPoolTokens &&
		!!userPoolBalance &&
		// this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
		JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
			? [
					pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
					pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
			  ]
			: [undefined, undefined]

	return (
		<div className="secondary-bg-color-darkest margin-lg text-left" style={{ borderRadius: '12px' }} {...props}>
			<div
				className="flex flex-justify-space-between padding-md"
				role="button"
				onClick={() => setShowMore(!showMore)}
			>
				<div className="flex col">
					<div className="flex flex-align-center margin-bottom-sm">
						<DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
						<span className="text text-bold margin-left-2xs">
							{!currency0 || !currency1 ? (
								<Dots>{t('Loading')}</Dots>
							) : (
								`${currency0.symbol}/${currency1.symbol}`
							)}
						</span>
					</div>
					<span className="text text-sm" color="textSubtle">
						{userPoolBalance?.toSignificant(4)}
					</span>
				</div>
				{showMore ? <Icon icon={IconEnum.ICON_ARROW_UP} /> : <Icon icon={IconEnum.ICON_ARROW_DOWN} />}
			</div>

			{showMore && (
				<AutoColumn gap="8px" style={{ padding: '16px' }}>
					<Row className="flex-justify-space-between padding-left-md">
						<Row>
							<CurrencyLogo size={20} currency={currency0} />
							<span className="text text-sm margin-left-2xs" color="textSubtle">
								{t('Pooled %asset%', { asset: currency0.symbol })}:
							</span>
						</Row>
						<div className="padding-right-md">
							{token0Deposited ? (
								<Row>
									<span className="text text-sm text-bold margin-left-xs">
										{token0Deposited?.toSignificant(6)}
									</span>
								</Row>
							) : (
								'-'
							)}
						</div>
					</Row>

					<Row className="flex-justify-space-between padding-left-md">
						<Row>
							<CurrencyLogo size={20} currency={currency1} />
							<span className="text text-sm margin-left-2xs" color="textSubtle">
								{t('Pooled %asset%', { asset: currency1.symbol })}:
							</span>
						</Row>
						<div className="padding-right-md">
							{token1Deposited ? (
								<Row>
									<span className="text text-sm text-bold margin-left-xs">
										{token1Deposited?.toSignificant(6)}
									</span>
								</Row>
							) : (
								'-'
							)}
						</div>
					</Row>

					<Row className="flex-justify-space-between padding-left-md">
						<span className="text text-sm" color="textSubtle">
							{t('Share of Pool')}
						</span>
						<span className="text text-sm text-bold padding-right-md">
							{poolTokenPercentage
								? `${
										poolTokenPercentage.toFixed(2) === '0.00'
											? '<0.01'
											: poolTokenPercentage.toFixed(2)
								  }%`
								: '-'}
						</span>
					</Row>

					{userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) && (
						<div className="flex col">
							<div className="text-center margin-sm">
								<Link href={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`} passHref>
									<NormalButton variant="primary" classes={{ other: 'width-100 text-base' }}>
										{t('Remove Liquidity')}
									</NormalButton>
								</Link>
							</div>

							<div className="text-center margin-sm">
								<Link
									href={`/remove-single/${currencyId(currency0)}/${currencyId(currency1)}`}
									passHref
								>
									<NormalButton classes={{ other: 'width-100 text-base' }} variant="primary">
										{t('Remove Single Liquidity')}
									</NormalButton>
								</Link>
							</div>

							<div className="text-center margin-sm">
								<Link href={`/add/${currencyId(currency0)}/${currencyId(currency1)}`} passHref>
									<NormalButton variant="default" classes={{ other: 'width-100' }}>
										<div>
											<Icon className="padding-2xs" icon={IconEnum.ICON_PLUS} />
											<span className="text-bold">{t('Add liquidity instead')}</span>
										</div>
									</NormalButton>
								</Link>
							</div>
						</div>
					)}
				</AutoColumn>
			)}
		</div>
	)
}
