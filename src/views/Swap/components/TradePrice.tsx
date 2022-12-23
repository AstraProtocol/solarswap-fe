import { Icon } from '@astraprotocol/astra-ui'
import { Price } from '@solarswap/sdk'
import { useTranslation } from 'contexts/Localization'
import styles from './styles.module.scss'

interface TradePriceProps {
	price?: Price
	showInverted: boolean
	setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
	const { t } = useTranslation()
	const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

	const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
	const label = showInverted
		? `${price?.quoteCurrency?.symbol} ${t('Per')} ${price?.baseCurrency?.symbol}`
		: `${price?.baseCurrency?.symbol} ${t('Per')} ${price?.quoteCurrency?.symbol}`

	return (
		<span className="text text-base" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
			{show ? (
				<>
					{formattedPrice ?? '-'} {label}
					<div className={styles.viewBalanceMaxMini} onClick={() => setShowInverted(!showInverted)}>
						<Icon icon={'renew'} width="14px" />
					</div>
				</>
			) : (
				'-'
			)}
		</span>
	)
}
