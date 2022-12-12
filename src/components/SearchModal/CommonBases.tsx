import { ChainId, Currency, currencyEquals, ETHER, Token } from '@solarswap/sdk'
import { useTranslation } from 'contexts/Localization'

import { SUGGESTED_BASES } from '../../config/constants'
// import QuestionHelper from '../QuestionHelper'
// import { AutoRow } from '../Layout/Row'
import { CurrencyLogo } from '../Logo'

// const BaseWrapper = styled.div<{ disable?: boolean }>`
// 	border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.colors.dropdown)};
// 	border-radius: 10px;
// 	display: flex;
// 	padding: 6px;

// 	align-items: center;
// 	:hover {
// 		cursor: ${({ disable }) => !disable && 'pointer'};
// 		background-color: ${({ theme, disable }) => !disable && theme.colors.background};
// 	}

// 	background-color: ${({ theme, disable }) => disable && theme.colors.dropdown};
// 	opacity: ${({ disable }) => disable && '0.4'};
// `

export default function CommonBases({
	chainId,
	onSelect,
	selectedCurrency
}: {
	chainId?: ChainId
	selectedCurrency?: Currency | null
	onSelect: (currency: Currency) => void
}) {
	const { t } = useTranslation()
	return (
		<div className="margin-lg">
			<div>
				<span className="text text-sm contrast-color-100">{t('Common bases')}</span>
				{/* <QuestionHelper text={t('These tokens are commonly paired with other tokens.')} ml="4px" /> */}
			</div>
			<div>
				<div
					onClick={() => {
						if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
							onSelect(ETHER)
						}
					}}
					// disable={selectedCurrency === ETHER}
				>
					<CurrencyLogo currency={ETHER} style={{ marginRight: 8 }} />
					<span className="text text-base contrast-color-100">ASA</span>
				</div>
				{(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
					const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
					return (
						<div
							key={token.address}
							onClick={() => !selected && onSelect(token)}
							// disable={selected} key={token.address}
						>
							<CurrencyLogo currency={token} style={{ marginRight: 8, borderRadius: '50%' }} />
							<span className="text text-base contrast-color-100">{token.symbol}</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}
