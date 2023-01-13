import { Currency, Token } from '@solarswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { CurrencyLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getAstraExplorerLink } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useUnsupportedTokens } from '../hooks/Tokens'
import { InjectedModalProps, Modal, useModal } from './Modal'
import { Icon, IconEnum, NormalButton, Row, Typography } from '@astraprotocol/astra-ui'

interface Props extends InjectedModalProps {
	currencies: (Currency | undefined)[]
}

const UnsupportedModal: React.FC<Props> = ({ currencies, onDismiss }) => {
	const { chainId } = useActiveWeb3React()
	const { t } = useTranslation()
	const tokens =
		chainId && currencies
			? currencies.map(currency => {
					return wrappedCurrency(currency, chainId)
			  })
			: []

	const unsupportedTokens: { [address: string]: Token } = useUnsupportedTokens()

	return (
		<Modal title={t('Unsupported Assets')} style={{ maxWidth: 420 }} onDismiss={onDismiss}>
			<div>
				{tokens.map(token => {
					return (
						token &&
						unsupportedTokens &&
						Object.keys(unsupportedTokens).includes(token.address) && (
							<div key={token.address?.concat('not-supported')}>
								<div className="row flex flex-align-center">
									<CurrencyLogo currency={token} size={24} />
									<span>{token.symbol}</span>
								</div>
								{chainId && (
									<Typography.Link
										target="_blank"
										href={getAstraExplorerLink(token.address, 'address', chainId)}
									>
										{token.address}
										<Icon
											icon={IconEnum.ICON_EXTERNAL_LINK}
											classes="margin-left-xs link-color-useful"
										/>
									</Typography.Link>
								)}
							</div>
						)
					)
				})}
				<div>
					<span className="text text-base">
						{t(
							'Some assets are not available through this interface because they may not work well with our smart contract or we are unable to allow trading for legal reasons.'
						)}
					</span>
				</div>
			</div>
		</Modal>
	)
}

export default function UnsupportedCurrencyFooter({ currencies }: { currencies: (Currency | undefined)[] }) {
	const { t } = useTranslation()
	const [onPresentModal] = useModal(<UnsupportedModal currencies={currencies} />)

	return (
		<div>
			<NormalButton variant="text" onClick={onPresentModal}>
				{t('Read more about unsupported assets')}
			</NormalButton>
		</div>
	)
}
