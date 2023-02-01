import Link, { LinkProps } from 'next/link'
import styles from './Link.module.scss'

interface Props extends LinkProps {
	children?: JSX.Element | JSX.Element[] | string | string[]
}

const InternalLink: React.FC<LinkProps> = ({ children, ...props }: Props) => {
	return (
		<Link {...props}>
			<a className={styles.link}>{children}</a>
		</Link>
	)
}

export default InternalLink
