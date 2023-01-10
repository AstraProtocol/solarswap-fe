import Link, { LinkProps } from 'next/link'
import styles from './Link.module.scss'

import clsx from 'clsx'

const StyledInternalLink = ({ children }) => <a className={styles.link}>{children}</a>

const InternalLink: React.FC<LinkProps> = ({ children, ...props }) => {
	return (
		<Link {...props}>
			<StyledInternalLink>{children}</StyledInternalLink>
		</Link>
	)
}

export default InternalLink
