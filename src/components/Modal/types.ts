import React from 'react'

export interface ModalTheme {
	background: string
}

export type Handler = () => void

export interface InjectedProps {
	onDismiss?: Handler
}

export interface ModalProps extends InjectedProps {
	title: string
	hideCloseButton?: boolean
	onBack?: () => void
	headerBackground?: string
	minWidth?: string
	style?: React.CSSProperties
	className?: string
	children: JSX.Element | JSX.Element[] | string | string[]
}
