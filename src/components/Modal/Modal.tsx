import { IconButton, IconEnum, Row } from '@astraprotocol/astra-ui'
import clsx from 'clsx'
import React from 'react'
import styles from './style.module.scss'
import { ModalProps } from './types'

const Modal: React.FC<ModalProps> = ({
	title,
	onDismiss,
	onBack,
	children,
	hideCloseButton = false,
	bodyPadding = '24px',
	headerBackground = 'transparent',
	minWidth = '520px',
	...props
}) => {
	return (
		<div style={{ minWidth }} {...props} className={clsx(styles.modal, 'border radius-lg')}>
			<Row
				style={{ justifyContent: 'space-between', flex: 0, background: headerBackground }}
				classes={clsx(
					styles.paddingHoz,
					styles.borderColor,
					'flex-align-center',
					'padding-left-lg padding-right-lg padding-top-md padding-bottom-md '
				)}
			>
				{onBack && <IconButton icon={IconEnum.ICON_BACK} onClick={onBack} />}
				<span className="text text-lg contrast-color-100">{title}</span>
				{!hideCloseButton && <IconButton icon={IconEnum.ICON_CLOSE} onClick={onDismiss} />}
			</Row>

			<div className={clsx(styles.modalBody, 'flex flex-align-center padding-top-md padding-bottom-md')}>
				{children}
			</div>
		</div>
	)
}

export default Modal
