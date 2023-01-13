import { Currency, Pair, Token } from '@solarswap/sdk'
import { CopyButton, Icon, IconEnum, NormalButton } from '@astraprotocol/astra-ui'
import Image from 'next/image'
import { registerToken } from 'utils/wallet'
import { isAddress } from 'utils'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import { Input as NumericalInput } from './NumericalInput'
import { useModal } from 'components/Modal'
import styles from './styles.module.scss'

interface CurrencyInputPanelProps {
	value: string
	onUserInput: (value: string) => void
	onMax?: () => void
	showMaxButton: boolean
	label?: string
	onCurrencySelect: (currency: Currency) => void
	currency?: Currency | null
	disableCurrencySelect?: boolean
	hideBalance?: boolean
	pair?: Pair | null
	otherCurrency?: Currency | null
	id: string
	showCommonBases?: boolean
}
export default function CurrencyInputPanel({
	value,
	onUserInput,
	onMax,
	showMaxButton,
	label,
	onCurrencySelect,
	currency,
	disableCurrencySelect = false,
	hideBalance = false,
	pair = null, // used for double token logo
	otherCurrency,
	id,
	showCommonBases
}: CurrencyInputPanelProps) {
	const { account, library } = useActiveWeb3React()
	const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
	const {
		t,
		currentLanguage: { locale }
	} = useTranslation()

	const token = pair ? pair.liquidityToken : currency instanceof Token ? currency : null
	const tokenAddress = token ? isAddress(token.address) : null

	const [onPresentCurrencyModal] = useModal(
		<CurrencySearchModal
			onCurrencySelect={onCurrencySelect}
			selectedCurrency={currency}
			otherSelectedCurrency={otherCurrency}
			showCommonBases={showCommonBases}
		/>
	)
	return (
		<div id={id}>
			<div className="flex flex-justify-space-between flex-align-center">
				<div className="flex">
					<NormalButton
						variant="text"
						className="open-currency-select-button"
						onClick={() => {
							if (!disableCurrencySelect) {
								onPresentCurrencyModal()
							}
						}}
					>
						<div className="flex flex-align-center flex-justify-space-between">
							{pair ? (
								<DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
							) : currency ? (
								<CurrencyLogo currency={currency} size={24} style={{ marginRight: '8px' }} />
							) : null}
							{pair ? (
								<span id="pair" className="text text-bold margin-left-xs">
									{pair?.token0.symbol}:{pair?.token1.symbol}
								</span>
							) : (
								<span id="pair" className="text text-bold margin-left-xs">
									{(currency && currency.symbol && currency.symbol.length > 20
										? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
												currency.symbol.length - 5,
												currency.symbol.length
										  )}`
										: currency?.symbol) || t('Select a currency')}
								</span>
							)}
							{!disableCurrencySelect && <Icon icon={IconEnum.ICON_ARROW_DOWN} />}
						</div>
					</NormalButton>
					{token && tokenAddress ? (
						<div className="flex flex-align-center" style={{ gap: '4px' }}>
							<CopyButton textCopy={tokenAddress} />
							{library?.provider?.isMetaMask && (
								<Image
									alt="metamask"
									src={'/images/logo/metamask.svg'}
									style={{ cursor: 'pointer' }}
									width={16}
									height={16}
									onClick={() => registerToken(tokenAddress, token.symbol, token.decimals)}
								/>
							)}
						</div>
					) : null}
				</div>
				{account && (
					<span
						onClick={onMax}
						className="text text-sm contrast-color-70"
						style={{ display: 'inline', cursor: 'pointer' }}
					>
						{!hideBalance && !!currency
							? t('Balance: %balance%', {
									balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading')
							  })
							: ' -'}
					</span>
				)}
			</div>
			<div className="border radius-lg same-bg-color-50 margin-bottom-md margin-left-sm">
				<div className={styles.labelRow}>
					<NumericalInput
						className={`token-amount-${id.replace('swap-currency-', '')}`}
						value={value}
						onUserInput={val => {
							onUserInput(val)
						}}
					/>
				</div>
				<div className={styles.inputRow}>
					{account && currency && showMaxButton && label !== 'To' && (
						<NormalButton variant="text" classes={{ color: 'secondary-color-normal' }} onClick={onMax}>
							{t('Max').toLocaleUpperCase(locale)}
						</NormalButton>
					)}
				</div>
			</div>
		</div>
	)
}
