import { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { Currency, CurrencyAmount, currencyEquals, ETHER, Token } from '@solarswap/sdk'
import { Row, Spinner } from '@astraprotocol/astra-ui'
import { FixedSizeList } from 'react-window'
import { wrappedCurrency } from 'utils/wrappedCurrency'
// import { LightGreyCard } from 'components/Card'
// import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedActiveList } from '../../state/lists/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useIsUserAddedToken } from '../../hooks/Tokens'
// import { RowFixed, RowBetween } from '../Layout/Row'
import { CurrencyLogo } from '../Logo'
// import CircleLoader from '../Loader/CircleLoader'
import { isTokenOnList } from '../../utils'
import ImportRow from './ImportRow'
import styles from './styles.module.scss'
import QuestionHelper from 'components/QuestionHelper'
import clsx from 'clsx'

function currencyKey(currency: Currency): string {
	return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

// const StyledBalanceText = styled(Text)`
// 	white-space: nowrap;
// 	overflow: hidden;
// 	max-width: 5rem;
// 	text-overflow: ellipsis;
// `

// const FixedContentRow = styled.div`
// 	padding: 4px 20px;
// 	height: 56px;
// 	display: grid;
// 	grid-gap: 16px;
// 	align-items: center;
// `

function Balance({ balance }: { balance: CurrencyAmount }) {
	return (
		<span className={styles.balanceText} title={balance.toExact()}>
			{balance.toSignificant(4)}
		</span>
	)
}

// const MenuItem = styled(RowBetween)<{ disabled: boolean; selected: boolean }>`
// 	padding: 4px 20px;
// 	height: 56px;
// 	display: grid;
// 	grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
// 	grid-gap: 8px;
// 	cursor: ${({ disabled }) => !disabled && 'pointer'};
// 	pointer-events: ${({ disabled }) => disabled && 'none'};
// 	:hover {
// 		background-color: ${({ theme, disabled }) => !disabled && theme.colors.background};
// 	}
// 	opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
// `

function CurrencyRow({
	currency,
	onSelect,
	isSelected,
	otherSelected,
	style,
}: {
	currency: Currency
	onSelect: () => void
	isSelected: boolean
	otherSelected: boolean
	style: CSSProperties
}) {
	const { account } = useActiveWeb3React()
	const key = currencyKey(currency)
	const selectedTokenList = useCombinedActiveList()
	const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
	const customAdded = useIsUserAddedToken(currency)
	const balance = useCurrencyBalance(account ?? undefined, currency)

	// only show add or remove buttons if not on selected list
	return (
		<div
			style={style}
			className={clsx(
				`token-item-${key}`,
				styles.currencyMenuItem,
				(isSelected || otherSelected) && styles.currencyMenuItemDisabled,
			)}
			onClick={() => (isSelected ? null : onSelect())}
		>
			<CurrencyLogo currency={currency} size={32} />
			<div className="flex col">
				<span className="text text-base text-bold">{currency.symbol}</span>
				<span className="text text-sm text-ellipsis">
					{!isOnSelectedList && customAdded && 'Added by user •'} {currency.name}
				</span>
			</div>
			<Row style={{ justifySelf: 'flex-end', alignItems: 'center' }}>
				{balance ? <Balance balance={balance} /> : account ? <Spinner /> : null}
			</Row>
		</div>
	)
}

export default function CurrencyList({
	height,
	currencies,
	inactiveCurrencies,
	selectedCurrency,
	onCurrencySelect,
	otherCurrency,
	fixedListRef,
	showETH,
	showImportView,
	setImportToken,
	breakIndex,
}: {
	height: number
	currencies: Currency[]
	inactiveCurrencies: Currency[]
	selectedCurrency?: Currency | null
	onCurrencySelect: (currency: Currency) => void
	otherCurrency?: Currency | null
	fixedListRef?: MutableRefObject<FixedSizeList | undefined>
	showETH: boolean
	showImportView: () => void
	setImportToken: (token: Token) => void
	breakIndex: number | undefined
}) {
	const itemData: (Currency | undefined)[] = useMemo(() => {
		let formatted: (Currency | undefined)[] = showETH
			? [Currency.ETHER, ...currencies, ...inactiveCurrencies]
			: [...currencies, ...inactiveCurrencies]
		if (breakIndex !== undefined) {
			formatted = [...formatted.slice(0, breakIndex), undefined, ...formatted.slice(breakIndex, formatted.length)]
		}
		return formatted
	}, [breakIndex, currencies, inactiveCurrencies, showETH])

	const { chainId } = useActiveWeb3React()

	const { t } = useTranslation()

	const Row = useCallback(
		({ data, index, style }) => {
			const currency: Currency = data[index]
			const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
			const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
			const handleSelect = () => onCurrencySelect(currency)

			const token = wrappedCurrency(currency, chainId)

			const showImport = index > currencies.length

			if (index === breakIndex || !data) {
				return (
					<div className={styles.fixedContentRow} style={style}>
						<div className="border radius-sm padding-top-xs padding-bottom-xs padding-left-sm padding-right-sm">
							{/** LightGreyCard */}
							<div className="row flex flex-justify-space-between">
								<span className="text text-xs contrast-color-100">
									{t('Expanded results from inactive Token Lists')}
								</span>
								<QuestionHelper
									text={t(
										"Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists.",
									)}
								/>
							</div>
						</div>
					</div>
				)
			}

			if (showImport && token) {
				return (
					<ImportRow
						style={style}
						token={token}
						showImportView={showImportView}
						setImportToken={setImportToken}
						dim
					/>
				)
			}
			return (
				<CurrencyRow
					style={style}
					currency={currency}
					isSelected={isSelected}
					onSelect={handleSelect}
					otherSelected={otherSelected}
				/>
			)
		},
		[
			selectedCurrency,
			otherCurrency,
			chainId,
			currencies.length,
			breakIndex,
			onCurrencySelect,
			t,
			showImportView,
			setImportToken,
		],
	)

	const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

	return (
		<FixedSizeList
			height={height}
			ref={fixedListRef as any}
			width="100%"
			itemData={itemData}
			itemCount={itemData.length}
			itemSize={56}
			itemKey={itemKey}
		>
			{Row}
		</FixedSizeList>
	)
}
