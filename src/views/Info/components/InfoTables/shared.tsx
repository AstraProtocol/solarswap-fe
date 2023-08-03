import clsx from 'clsx'
import styles from './styles.module.scss'

export const ClickableColumnHeader = children => <span className={styles.clickableColumnHeader}>{children}</span>

export const TableWrapper = children => <div className={clsx(styles.tableWrapper, 'flex')}>{children}</div>

export const PageButtons = children => <div className={clsx(styles.pageButtons)}>{children}</div>

export const Arrow = children => <div className={clsx(styles.arrow)}>{children}</div>

export const Break = children => <div className={clsx(styles.break)}>{children}</div>
