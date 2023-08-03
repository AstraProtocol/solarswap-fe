import clsx from 'clsx'
import styles from './styles.module.scss'

export const ClickableColumnHeader = ({ children, ...props }) => (
	<span {...props} className={clsx(styles.clickableColumnHeader, props.className)}>
		{children}
	</span>
)

export const TableWrapper = ({ children, ...props }) => (
	<div {...props} className={clsx(styles.tableWrapper, 'flex', props.className)}>
		{children}
	</div>
)

export const PageButtons = ({ children, ...props }) => (
	<div {...props} className={clsx(styles.pageButtons, props.className)}>
		{children}
	</div>
)

export const Arrow = ({ children, ...props }) => (
	<div {...props} className={clsx(styles.arrow, props.className)}>
		{children}
	</div>
)

export const Break = ({ ...props }) => <div {...props} className={clsx(styles.break, props.className)} />
