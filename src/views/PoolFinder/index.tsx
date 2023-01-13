import { useCallback, useEffect, useState } from 'react'
import { Currency, ETHER, JSBI, TokenAmount } from '@solarswap/sdk'
// import { Button } from '@solarswap/uikit'
import { useModal } from 'components/Modal'
// import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
// import { Link } from 'components/NextLink'

import { AutoColumn, ColumnCenter } from '../../components/Layout/Column'
import { CurrencyLogo } from '../../components/Logo'
import { MinimalPositionCard } from '../../components/PositionCard'
import Link from 'next/link'
import { Form, Icon, IconButton, IconEnum, NormalButton, Row } from '@astraprotocol/astra-ui'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../hooks/usePairs'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
// import Dots from '../../components/Loader/Dots'
import styles from './styles.module.scss'
import { AppHeader, AppBody } from '../../components/App'
import Page from 'components/Layout/Page'

enum Fields {
	TOKEN0 = 0,
	TOKEN1 = 1
}

// const StyledButton = styled(Button)`
// 	background-color: ${({ theme }) => theme.colors.input};
// 	color: ${({ theme }) => theme.colors.text};
// 	box-shadow: none;
// 	border-radius: 16px;
// `

export default function PoolFinder() {
	const { account } = useActiveWeb3React()
	const { t } = useTranslation()

	const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)
	const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
	const [currency1, setCurrency1] = useState<Currency | null>(null)

	const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
	const addPair = usePairAdder()
	useEffect(() => {
		if (pair) {
			addPair(pair)
		}
	}, [pair, addPair])

	const validPairNoLiquidity: boolean =
		pairState === PairState.NOT_EXISTS ||
		Boolean(
			pairState === PairState.EXISTS &&
				pair &&
				JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
				JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
		)

	const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
	const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

	const handleCurrencySelect = useCallback(
		(currency: Currency) => {
			if (activeField === Fields.TOKEN0) {
				setCurrency0(currency)
			} else {
				setCurrency1(currency)
			}
		},
		[activeField]
	)

	const prerequisiteMessage = (
		<div className="border border-base radius-lg text-center padding-top-xl padding-bottom-xl margin-top-md">
			<span className="text text-base">
				{!account ? t('Connect to a wallet to find pools') : t('Select a token to find your liquidity.')}
			</span>
		</div>
	)

	const [onPresentCurrencyModal] = useModal(
		<CurrencySearchModal
			onCurrencySelect={handleCurrencySelect}
			showCommonBases
			selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
		/>,
		true,
		true,
		'selectCurrencyModal'
	)

	return (
		<Page>
			<div className="flex flex-justify-center">
				<AppBody className="border border-base radius-lg">
					<AppHeader title={t('Import Pool')} subtitle={t('Import an existing pool')} backTo="/liquidity" />
					<div className="flex col" style={{ padding: '2rem' }}>
						<NormalButton
							// endIcon={<Icon icon={IconEnum.ICON_DROPDOWN} />}
							classes={{ other: 'width-100 text-base' }}
							onClick={() => {
								onPresentCurrencyModal()
								setActiveField(Fields.TOKEN0)
							}}
						>
							{currency0 ? (
								<Row className="flex-justify-space-between">
									<Row>
										<CurrencyLogo currency={currency0} />
										<span className="text text-base text-bold padding-left-2xs">
											{currency0.symbol}
										</span>
									</Row>
									<Icon icon={IconEnum.ICON_DROPDOWN} className="padding-right-2xs"></Icon>
								</Row>
							) : (
								<Row className="flex-justify-space-between">
									<Row>
										<span className="text">{t('Select a Token')}</span>
									</Row>
									<Icon icon={IconEnum.ICON_DROPDOWN} className="padding-right-2xs"></Icon>
								</Row>
							)}
						</NormalButton>

						<ColumnCenter>
							<Icon icon={IconEnum.ICON_PLUS} className="padding-lg" />
						</ColumnCenter>

						<NormalButton
							// endIcon={<Icon icon={IconEnum.ICON_DROPDOWN} />}
							classes={{ other: 'width-100 text-base margin-bottom-lg' }}
							onClick={() => {
								onPresentCurrencyModal()
								setActiveField(Fields.TOKEN1)
							}}
						>
							{currency1 ? (
								<Row className="flex-justify-space-between">
									<Row>
										<CurrencyLogo currency={currency1} />
										<span className="text text-base text-bold padding-left-2xs">
											{currency1.symbol}
										</span>
									</Row>
									<Icon icon={IconEnum.ICON_DROPDOWN} className="padding-right-2xs"></Icon>
								</Row>
							) : (
								<Row className="flex-justify-space-between">
									<Row>
										<span className="text">{t('Select a Token')}</span>
									</Row>
									<Icon icon={IconEnum.ICON_DROPDOWN} className="padding-right-2xs"></Icon>
								</Row>
							)}
						</NormalButton>

						{currency0 && currency1 ? (
							pairState === PairState.EXISTS ? (
								hasPosition && pair ? (
									<>
										<MinimalPositionCard pair={pair} />
										<Link href="/pool" passHref>
											<NormalButton classes={{ other: 'width-100 text-base' }} variant="default">
												{t('Manage this pool')}
											</NormalButton>
										</Link>
									</>
								) : (
									<div className="border border-base radius-lg text-center padding-top-xl padding-bottom-lg margin-top-md">
										<div className="felx col padding-sm flex-justify-center">
											<span className="text text-center text-base">
												{t('You don’t have liquidity in this pool yet.')}
											</span>
											<Link
												href={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
												passHref
											>
												<NormalButton
													classes={{ other: 'width-100 text-base margin-top-xl' }}
													variant="default"
												>
													{t('Add Liquidity')}
												</NormalButton>
											</Link>
										</div>
									</div>
								)
							) : validPairNoLiquidity ? (
								<div className="border border-base radius-lg text-center padding-top-xl padding-bottom-xl margin-top-md">
									<AutoColumn gap="sm" justify="center">
										<span className="text text-center text-base">{t('No pool found.')}</span>
										<Link href={`/add/${currencyId(currency0)}/${currencyId(currency1)}`} passHref>
											<NormalButton
												classes={{ other: 'width-100 text-base margin-top-lg' }}
												variant="default"
											>
												{t('Create pool')}
											</NormalButton>
										</Link>
									</AutoColumn>
								</div>
							) : pairState === PairState.INVALID ? (
								<div className="border border-base radius-lg text-center padding-top-xl padding-bottom-xl margin-top-md">
									<AutoColumn gap="sm" justify="center">
										<span className="text text-center text-base text-bold">
											{t('Invalid pair.')}
										</span>
									</AutoColumn>
								</div>
							) : pairState === PairState.LOADING ? (
								<div className="border border-base radius-lg text-center padding-top-xl padding-bottom-xl margin-top-md">
									<AutoColumn gap="sm" justify="center">
										<span className="text text-lg text-center">
											{t('Loading')}
											<span className={styles.dots}>{t('Loading')}</span>
											{/* <Dots /> */}
										</span>
									</AutoColumn>
								</div>
							) : null
						) : (
							prerequisiteMessage
						)}
					</div>

					{/* <CurrencySearchModal
          isOpen={showSearch}
          onCurrencySelect={handleCurrencySelect}
          onDismiss={handleSearchDismiss}
          showCommonBases
          selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
        /> */}
				</AppBody>
			</div>
		</Page>
	)
}
