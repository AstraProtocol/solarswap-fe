import { Currency, ETHER, Token } from '@solarswap/sdk'
import { useMemo } from 'react'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import getTokenLogoURL from '../../utils/getTokenLogoURL'
import AstraIcon from './AstraIcon'
import Logo from './Logo'

export const isETHER = (currency: Currency | Token) =>
	JSON.stringify(currency) === JSON.stringify(ETHER) || currency?.symbol === 'WASA'

export default function CurrencyLogo({
	currency,
	size = 24,
	style,
}: {
	currency?: Currency | Token
	size?: number
	style?: React.CSSProperties
}) {
	const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

	const srcs: string[] = useMemo(() => {
		if (currency === ETHER) return []

		if (currency instanceof Token) {
			if (currency instanceof WrappedTokenInfo) {
				return [...uriLocations, getTokenLogoURL(currency.address)]
			}
			return [getTokenLogoURL(currency.address)]
		}
		return []
	}, [currency, uriLocations])

	if (isETHER(currency)) {
		return <AstraIcon height={size + 1} width={size + 1} style={style} />
	}

	// Fix: in case of token image not found in trustwallet cdc image
	if (currency instanceof Token && currency.address) {
		const currentHost = window.location.host

		const image = `${currentHost}/images/tokens/${currency.address}.png`
		if (!srcs.includes(image)) srcs.push()
	}

	return (
		<Logo
			className="radius-50"
			width={size}
			height={size}
			srcs={srcs}
			objectFit="contain"
			alt={`${currency?.symbol ?? 'token'} logo`}
			style={style}
		/>
	)
}
