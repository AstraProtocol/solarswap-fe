import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { Icon, IconEnum } from '@astraprotocol/astra-ui'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps extends Omit<ImageProps, 'src'> {
	srcs: string[]
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: React.FC<LogoProps> = ({ srcs, alt, ...rest }) => {
	const [, refresh] = useState<number>(0)
	const src: string | undefined = srcs.find(s => !BAD_SRCS[s])

	if (src) {
		return (
			<Image
				{...rest}
				alt={alt}
				src={src}
				onError={() => {
					if (src) BAD_SRCS[src] = true
					refresh(i => i + 1)
				}}
			/>
		)
	}

	return <Icon icon={IconEnum.ICON_WARNING} style={{ fontSize: rest.height }} />
}

export default Logo
