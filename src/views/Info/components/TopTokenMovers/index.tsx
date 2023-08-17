import Card from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import { LegacyRef, MutableRefObject, forwardRef, useEffect, useMemo, useRef } from 'react'
import { useAllTokenDataSWR } from 'state/info/hooks'
import { TokenData } from 'state/info/types'
import { formatAmount } from 'utils/formatInfoNumbers'
// import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import Percent from 'views/Info/components/Percent'
import style from './style.module.scss'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { CurrencyLogo } from 'components/Logo'
import { Row } from '@astraprotocol/astra-ui'
import { Token } from '@solarswap/sdk'
import { CHAIN_ID } from 'config/constants/networks'
import { EthereumAddress } from 'config/constants/types'

const CardWrapper = ({ children, to }: { children: React.ReactNode; to: string }) => (
	<NextLinkFromReactRouter className={style.cardWrapper} to={to}>
		{children}
	</NextLinkFromReactRouter>
)

const TopMoverCard = ({ children }: { children: React.ReactNode }) => (
	<div className={style.topMoverCard}>{children}</div>
)

export const ScrollableRow = ({ children, ref }: { ref: LegacyRef<HTMLDivElement>; children: React.ReactNode }) => (
	<div className={style.scrollableRow} ref={ref}>
		{children}
	</div>
)

const DataCard = ({ tokenData }: { tokenData: TokenData }) => {
	const token = new Token(parseInt(CHAIN_ID), tokenData.address as EthereumAddress, 18, '')
	return (
		<CardWrapper to={`/info/tokens/${tokenData.address}`}>
			<TopMoverCard>
				<Row className="flex-align-center">
					<div>
						{/* wrapped in a box because of alignment issues between img and svg */}
						<CurrencyLogo currency={token} size={32} />
					</div>
					<div className="margin-left-md">
						<span className="text text-base">{tokenData.symbol}</span>
						<Row className="flex-align-center">
							<span className="text text-sm margin-right-xs">${formatAmount(tokenData.priceUSD)}</span>
							<Percent value={tokenData.priceUSDChange} />
						</Row>
					</div>
				</Row>
			</TopMoverCard>
		</CardWrapper>
	)
}

const TopTokenMovers: React.FC<React.PropsWithChildren> = () => {
	const allTokens = useAllTokenDataSWR()
	const { t } = useTranslation()

	const topPriceIncrease = useMemo(() => {
		return Object.values(allTokens)
			.sort(({ data: a }, { data: b }) => {
				// eslint-disable-next-line no-nested-ternary
				return a && b ? (Math.abs(a?.priceUSDChange) > Math.abs(b?.priceUSDChange) ? -1 : 1) : -1
			})
			.slice(0, Math.min(20, Object.values(allTokens).length))
			.filter(d => d?.data?.exists)
	}, [allTokens])

	const increaseRef = useRef<HTMLDivElement>(null)
	const moveLeftRef = useRef<boolean>(true)

	useEffect(() => {
		const scrollInterval = setInterval(() => {
			if (increaseRef.current) {
				if (
					increaseRef.current.scrollLeft ===
					increaseRef.current.scrollWidth - increaseRef.current.clientWidth
				) {
					moveLeftRef.current = false
				} else if (increaseRef.current.scrollLeft === 0) {
					moveLeftRef.current = true
				}
				increaseRef.current.scrollTo(
					moveLeftRef.current ? increaseRef.current.scrollLeft + 1 : increaseRef.current.scrollLeft - 1,
					0,
				)
			}
		}, 30)

		return () => {
			clearInterval(scrollInterval)
		}
	}, [])

	if (topPriceIncrease.length === 0 || !topPriceIncrease.some(entry => entry.data)) {
		return null
	}

	return (
		<Card>
			<span className="text text-base text-bold margin-left-md margin-top-sm">{t('Top Movers')}</span>
			<ScrollableRow ref={increaseRef}>
				{topPriceIncrease.map(entry =>
					entry.data ? (
						<DataCard key={`top-card-token-${entry.data?.address}`} tokenData={entry.data} />
					) : null,
				)}
			</ScrollableRow>
		</Card>
	)
}

export default TopTokenMovers
