import { CSSProperties } from 'react'
import styles from './styles.module.scss'

export interface FlexGapProps extends CSSProperties {
	gap?: string
	rowGap?: string
	columnGap?: string
	children: JSX.Element | JSX.Element[] | string | string[]
}

export const Flex = ({ children, ...props }) => (
	<div {...props} className="flex">
		{children}
	</div>
)

export const FlexGap = ({ children, gap, rowGap, columnGap, ...style }: FlexGapProps) => (
	<Flex
		style={{
			gap,
			rowGap: rowGap,
			columnGap: columnGap,
			...style,
		}}
	>
		{children}
	</Flex>
)

const FlexLayout = ({ children }) => <div className={styles.flexLayout}>{children}</div>

export default FlexLayout
