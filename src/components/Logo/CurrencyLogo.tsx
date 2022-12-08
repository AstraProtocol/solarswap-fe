import { Currency, ETHER, Token } from '@solarswap/sdk'
import { useMemo } from 'react'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import getTokenLogoURL from '../../utils/getTokenLogoURL'
import AstraIcon from './AstraIcon'
import Logo from './Logo'


export default function CurrencyLogo({
	currency,
	size = '24px',
	style
}: {
	currency?: Currency | Token
	size?: string
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

	if (JSON.stringify(currency) === JSON.stringify(ETHER)) {
		return <AstraIcon width={size} style={style} />
	}

	// Fix: in case of token image not found in trustwallet cdc image
	if (currency instanceof Token && currency.address) {
		srcs.push(`${process.env.NEXT_PUBLIC_HOST}/images/tokens/${currency.address}.png`)
	}

	return (
		<Logo
			className="radius-50"
			width={size}
			height={size}
			srcs={srcs}
			alt={`${currency?.symbol ?? 'token'} logo`}
			style={style}
		/>
	)
}
