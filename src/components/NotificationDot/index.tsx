import clsx from 'clsx'
import React, { cloneElement, Children, ReactElement } from 'react'
import styles from './styles.module.scss'

const NotificationDot = ({ show = false, color = 'failure', children, ...props }) => (
	<div>
		{Children.map(children, (child: ReactElement) => cloneElement(child, props))}
		<div className={clsx(styles.notificationDot, !show && styles.hide)} />
	</div>
)

export default NotificationDot
