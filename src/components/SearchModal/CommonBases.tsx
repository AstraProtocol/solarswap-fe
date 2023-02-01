import { NormalButton, Row } from '@astraprotocol/astra-ui'
import { ChainId, Currency, currencyEquals, ETHER, Token } from '@solarswap/sdk'
import clsx from 'clsx'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import { SUGGESTED_BASES } from '../../config/constants'
import { CurrencyLogo } from '../Logo'
import styles from './styles.module.scss'

export default function CommonBases({
	chainId,
	onSelect,
	selectedCurrency,
}: {
	chainId?: ChainId
	selectedCurrency?: Currency | null
	onSelect: (currency: Currency) => void
}) {
	const { t } = useTranslation()
	const suggestedBases = chainId ? SUGGESTED_BASES[chainId] : []
	return (
		<div className="">
			<Row>
				<span className="text text-sm contrast-color-100 margin-right-xs">{t('Common bases')}</span>
				<QuestionHelper text={t('These tokens are commonly paired with other tokens.')} placement="top" />
			</Row>
			<Row style={{ justifyContent: 'space-between' }}>
				<NormalButton
					variant="default"
					classes={{ other: clsx(styles.baseWrapper, 'border border-base margin-right-xs') }}
					onClick={() => {
						if (selectedCurrency === ETHER) return
						if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
							onSelect(ETHER)
						}
					}}
					disabled={selectedCurrency === ETHER}
				>
					<CurrencyLogo currency={ETHER} />
					<span className="text text-base contrast-color-100 margin-left-xs">ASA</span>
				</NormalButton>
				{suggestedBases.map((token: Token, index: number) => {
					const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
					return (
						<NormalButton
							variant="default"
							classes={{
								other: clsx(styles.baseWrapper, 'border border-base', {
									['margin-right-xs']: index != suggestedBases.length - 1,
								}),
							}}
							key={token.address}
							onClick={() => !selected && onSelect(token)}
							disabled={selected}
						>
							<CurrencyLogo currency={token} style={{ marginRight: 8, borderRadius: '50%' }} />
							<span className="text text-base contrast-color-100 margin-left-xs">{token.symbol}</span>
						</NormalButton>
					)
				})}
			</Row>
		</div>
	)
}
