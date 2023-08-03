import clsx from 'clsx'
import styles from './styles.module.scss'
import { SVGAttributes } from 'react'

const Svg = ({ spin = false, ...props }) => (
	<svg
		className={clsx(styles.svg, {
			[styles.svgSpin]: spin,
		})}
		{...props}
	/>
)

Svg.defaultProps = {
	spin: false,
}

export interface SvgProps extends SVGAttributes<HTMLOrSVGElement> {
	theme?: string
	spin?: boolean
}

export default Svg
