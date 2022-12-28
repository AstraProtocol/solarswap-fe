import { Currency, Token } from '@solarswap/sdk'
// import { Button, Text, Modal, useModal, InjectedModalProps, Link } from '@solarswap/uikit'
import { useTranslation } from 'contexts/Localization'
// import styled from 'styled-components'
// import { AutoRow } from 'components/Layout/Row'
// import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getAstraScanLink } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useUnsupportedTokens } from '../hooks/Tokens'
import { InjectedModalProps, Modal, useModal } from './Modal'
import { NormalButton, Row, Typography } from '@astraprotocol/astra-ui'

interface Props extends InjectedModalProps {
	currencies: (Currency | undefined)[]
}

// const DetailsFooter = styled.div`
// 	padding: 8px 0;
// 	width: 100%;
// 	max-width: 400px;
// 	border-bottom-left-radius: 20px;
// 	border-bottom-right-radius: 20px;
// 	color: ${({ theme }) => theme.colors.text};
// 	background-color: ${({ theme }) => theme.colors.invertedContrast};
// 	text-align: center;
// `

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
		<Modal title={t('Unsupported Assets')} maxWidth="420px" onDismiss={onDismiss}>
			<div gap="lg">
				{tokens.map(token => {
					return (
						token &&
						unsupportedTokens &&
						Object.keys(unsupportedTokens).includes(token.address) && (
							<div key={token.address?.concat('not-supported')} gap="10px">
								<Row gap="5px" align="center">
									<CurrencyLogo currency={token} size="24px" />
									<span>{token.symbol}</span>
								</Row>
								{chainId && (
									<Typography.Link
										// external
										small
										color="primaryDark"
										href={getAstraScanLink(token.address, 'address', chainId)}
									>
										{token.address}
									</Typography.Link>
								)}
							</div>
						)
					)
				})}
				<div gap="lg">
					<span>
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
