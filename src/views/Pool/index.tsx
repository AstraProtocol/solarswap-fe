import { useMemo } from 'react'
// import styled from 'styled-components'
// import { Text, Flex, CardBody, CardFooter, Button, AddIcon } from '@solarswap/uikit'
import Link from 'next/link'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
// import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs, PairState } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { NormalButton, Icon } from '@astraprotocol/astra-ui'
// import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import styles from './styles.module.scss'
import Page from 'components/Layout/Page'
import FullPositionCard from 'components/PositionCard'

// const Body = styled(CardBody)`
//   background-color: ${({ theme }) => theme.colors.dropdownDeep};
// `

export default function Pool() {
	const { account } = useActiveWeb3React()
	const { t } = useTranslation()

	// fetch the user's balances of all tracked V2 LP tokens
	const trackedTokenPairs = useTrackedTokenPairs()
	const tokenPairsWithLiquidityTokens = useMemo(
		() => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
		[trackedTokenPairs]
	)
	const liquidityTokens = useMemo(
		() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken),
		[tokenPairsWithLiquidityTokens]
	)
	const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
		account ?? undefined,
		liquidityTokens
	)

	// fetch the reserves for all V2 pools in which the user has a balance
	const liquidityTokensWithBalances = useMemo(
		() =>
			tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
				v2PairsBalances[liquidityToken.address]?.greaterThan('0')
			),
		[tokenPairsWithLiquidityTokens, v2PairsBalances]
	)

	const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
	const v2IsLoading =
		fetchingV2PairBalances ||
		v2Pairs?.length < liquidityTokensWithBalances.length ||
		(v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
	const allV2PairsWithLiquidity = v2Pairs
		?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
		.map(([, pair]) => pair)

	const renderBody = () => {
		if (!account) {
			return <span className="text text-lg">{t('Connect to a wallet to view your liquidity.')}</span>
		}
		if (v2IsLoading) {
			return (
				<span className="text text-lg">
					<span className={styles.dots}>{t('Loading')}</span>
				</span>
			)
		}
		if (allV2PairsWithLiquidity?.length > 0) {
			return allV2PairsWithLiquidity.map((v2Pair, index) => (
				<FullPositionCard
					key={v2Pair.liquidityToken.address}
					pair={v2Pair}
					mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
				/>
			))
		}
		return <span className="text text-lg">{t('No liquidity found.')}</span>
	}

	return (
		<Page>
			<div className="flex flex-justify-center">
				<AppBody className="border border-base radius-lg">
					<AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
					<div className="text-center">
						{renderBody()}
						{account && !v2IsLoading && (
							<div className="flex flex-justify-center col md-margin-top-lg">
								<span className="text text-center margin-md margin-bottom-xs">
									{t("Don't see a pool you joined?")}
								</span>
								<div className="text-center padding-md">
									<Link href="/find" passHref>
										<NormalButton id="import-pool-link" variant="default" scale="sm" as="a">
											<span className="text-bold">{t('Find other LP tokens')}</span>
										</NormalButton>
									</Link>
								</div>
							</div>
						)}
					</div>
					<div className="text-center padding-md">
						<Link href="/add" passHref>
							<NormalButton
								classes={{ other: 'width-100 text-base' }}
								id="join-pool-button"
								startIcon={<Icon icon="icon-plus" />}
							>
								<div>
									<Icon className="padding-xs" icon="icon-plus" />
									{t('Add Liquidity')}
								</div>
							</NormalButton>
						</Link>
					</div>
					<div className="text-center padding-md">
						<Link href="/add-single" passHref>
							<NormalButton
								classes={{ other: 'width-100 text-base' }}
								id="join-pool-button"
								startIcon={<Icon icon="icon-plus" />}
							>
								<div>
									<Icon className="padding-xs" icon="icon-plus" />
									{t('Add Single Liquidity')}
								</div>
							</NormalButton>
						</Link>
					</div>
				</AppBody>
			</div>
		</Page>
	)
}
