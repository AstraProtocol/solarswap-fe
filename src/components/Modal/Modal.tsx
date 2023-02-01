import { IconButton, IconEnum, Row } from '@astraprotocol/astra-ui'
import clsx from 'clsx'
import React from 'react'
import styles from './styles.module.scss'
import { ModalProps } from './types'

const Modal: React.FC<ModalProps> = ({
	title,
	onDismiss,
	onBack,
	children,
	hideCloseButton = false,
	headerBackground = 'transparent',
	className,
	style,
	...props
}) => {
	return (
		<div
			style={{ minWidth: '320px', ...style }}
			{...props}
			className={clsx(styles.modal, 'border radius-lg', className)}
		>
			<Row
				style={{ justifyContent: 'space-between', flex: 0, background: headerBackground }}
				classes={clsx(
					styles.paddingHoz,
					styles.borderColor,
					'flex-align-center',
					'padding-left-lg padding-right-lg padding-top-md padding-bottom-md',
					'border border-bottom-base',
				)}
			>
				{onBack && <IconButton icon={IconEnum.ICON_BACK} onClick={onBack} />}
				<span className="text text-lg text-bold contrast-color-100">{title}</span>
				{!hideCloseButton && <IconButton icon={IconEnum.ICON_CLOSE} onClick={onDismiss} />}
			</Row>

			<div className={clsx(styles.modalBody, 'flex padding-lg')}>{children}</div>
		</div>
	)
}

export default Modal
