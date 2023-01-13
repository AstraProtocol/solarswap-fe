import React from 'react'
import { TokenPairImageProps, variants } from './types'
import Wrapper from './Wrapper'
import TokenImage from './TokenImage'
import styles from './styles.module.scss'
import clsx from 'clsx'

const TokenPairImage: React.FC<TokenPairImageProps> = ({
	primarySrc,
	secondarySrc,
	width,
	height,
	variant = variants.DEFAULT,
	primaryImageProps = {},
	secondaryImageProps = {},
	...props
}) => {
	const secondaryImageSize = Math.floor(width / 2)

	return (
		<Wrapper width={width} height={height} {...props}>
			<TokenImage
				className={clsx(styles.primaryImage, { [styles.inverted]: variant == variants.INVERTED })}
				src={primarySrc}
				width={width / 1.5}
				height={height / 1.5}
				{...primaryImageProps}
			/>
			<TokenImage
				className={clsx(styles.secondaryImage, { [styles.inverted]: variant == variants.INVERTED })}
				src={secondarySrc}
				width={secondaryImageSize}
				height={secondaryImageSize}
				{...secondaryImageProps}
			/>
		</Wrapper>
	)
}

export default TokenPairImage
