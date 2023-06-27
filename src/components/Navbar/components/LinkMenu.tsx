import { Typography } from '@astraprotocol/astra-ui'
import clsx from 'clsx'

import NavigationConnect from 'components/ButtonConnect/NavigationConnect'
import styles from '../style.module.scss'

export const LinkMenuLocale = ({
	onClick,
	label,

	classes,
	prefix,
}: {
	onClick: Function
	label?: React.ReactNode

	classes?: string
	prefix?: React.ReactNode
}) => (
	<div className={clsx('radius-base', 'padding-sm', styles.subItem)}>
		<span className="block-center">
			{!!prefix && prefix}
			<a className={clsx('text text-base', styles.link, classes)} onClick={() => onClick()}>
				{label}
			</a>
		</span>
	</div>
)

const Checked = () => <span className="icon-checked alert-color-success block-ver-center"></span>

export const LinkMenuItem = ({
	link,
	label,
	pathname,
	classes,
	prefix,
}: {
	link?: string
	label?: React.ReactNode
	pathname?: string
	classes?: string
	prefix?: React.ReactNode
}) => (
	<div
		className={clsx('radius-base', 'padding-sm', styles.subItem, {
			[styles.subActive]: pathname === link,
		})}
	>
		<span className="block-center">
			{!!prefix && prefix}
			<Typography.Link href={link || ''} classes={clsx('text text-base', styles.link, classes)}>
				{label}
			</Typography.Link>
		</span>
		{pathname === link && <Checked />}
	</div>
)

export const LinkMenuConnect = () => (
	<div className={clsx('radius-base padding-sm', styles.subItem)}>
		<NavigationConnect classes="width-100 " />
	</div>
)
