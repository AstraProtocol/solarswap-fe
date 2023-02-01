import clsx from 'clsx'
import styles from './styles.module.scss'

const Svg = ({ spin, ...props }) => (
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

export default Svg
