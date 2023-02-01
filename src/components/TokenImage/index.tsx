import {
	TokenPairImage as UIKitTokenPairImage,
	TokenPairImageProps as UIKitTokenPairImageProps,
	TokenImage as UIKitTokenImage,
	ImageProps,
} from '../Image'
import tokens from 'config/constants/tokens'
import { Token } from '@solarswap/sdk'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
	primaryToken: Token
	secondaryToken: Token
}

const getImageUrlFromToken = (token: Token) => {
	const address = token.symbol === 'WASA' ? tokens.wasa.address : token.address
	return `/images/tokens/${address}.svg`
}

export const TokenPairImage: React.FC<TokenPairImageProps> = ({ primaryToken, secondaryToken, ...props }) => {
	return (
		<UIKitTokenPairImage
			primarySrc={getImageUrlFromToken(primaryToken)}
			secondarySrc={getImageUrlFromToken(secondaryToken)}
			{...props}
		/>
	)
}

interface TokenImageProps extends ImageProps {
	token: Token
}

export const TokenImage: React.FC<TokenImageProps> = ({ token, ...props }) => {
	return <UIKitTokenImage src={getImageUrlFromToken(token)} {...props} />
}
