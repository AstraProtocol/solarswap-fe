import Image, { ImageProps } from 'next/image'

export interface LogoProps extends Omit<ImageProps, 'src'> {}

/**
 * Render Astra Icon
 */
const AstraIcon: React.FC<LogoProps> = ({ alt, ...rest }) => {
	return <Image {...rest} alt={alt} src={'/images/logo/asa.svg'} />
}

export default AstraIcon
