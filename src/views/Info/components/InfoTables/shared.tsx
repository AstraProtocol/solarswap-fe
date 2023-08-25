import clsx from 'clsx'
import styles from './styles.module.scss'
import { HTMLAttributes } from 'react'

interface SpanProps extends HTMLAttributes<HTMLSpanElement> {}
interface DivProps extends HTMLAttributes<HTMLDivElement> {}

export const ClickableColumnHeader = ({ children, ...props }: SpanProps) => (
	<span {...props} className={clsx(styles.clickableColumnHeader, props.className)}>
		{children}
	</span>
)

export const TableWrapper = ({ children, ...props }: DivProps) => (
	<div {...props} className={clsx(styles.tableWrapper, 'flex', props.className)}>
		{children}
	</div>
)

export const PageButtons = ({ children, ...props }: DivProps) => (
	<div {...props} className={clsx(styles.pageButtons, props.className)}>
		{children}
	</div>
)

export const Arrow = ({ children, ...props }: DivProps) => (
	<div {...props} className={clsx(styles.arrow, props.className)}>
		{children}
	</div>
)

export const Break = ({ ...props }: DivProps) => <div {...props} className={clsx(styles.break, props.className)} />
