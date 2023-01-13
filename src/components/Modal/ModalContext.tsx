import { AnimatePresence, m, Variants, LazyMotion, domAnimation } from 'framer-motion'
import React, { createContext, useState, useRef } from 'react'
import { Handler } from './types'
import styles from './styles.module.scss'
import Overlay from 'components/Overlay'
import clsx from 'clsx'
import { useTheme } from 'next-themes'

const animationMap = {
	initial: 'initial',
	animate: 'animate',
	exit: 'exit'
}

const animationVariants: Variants = {
	initial: { transform: 'translateX(0px)' },
	animate: { transform: 'translateX(0px)' },
	exit: { transform: 'translateX(0px)' }
}

interface ModalsContext {
	isOpen: boolean
	nodeId: string
	modalNode: React.ReactNode
	setModalNode: React.Dispatch<React.SetStateAction<React.ReactNode>>
	onPresent: (node: React.ReactNode, newNodeId: string) => void
	onDismiss: Handler
	setCloseOnOverlayClick: React.Dispatch<React.SetStateAction<boolean>>
}

export const Context = createContext<ModalsContext>({
	isOpen: false,
	nodeId: '',
	modalNode: null,
	setModalNode: () => null,
	onPresent: () => null,
	onDismiss: () => null,
	setCloseOnOverlayClick: () => true
})

interface Props {
	children?: JSX.Element | JSX.Element[] | string | string[]
}

const ModalProvider: React.FC<any> = ({ children }: Props) => {
	const [isOpen, setIsOpen] = useState(false)
	const [modalNode, setModalNode] = useState<React.ReactNode>()
	const [nodeId, setNodeId] = useState('')
	const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true)
	const animationRef = useRef<HTMLDivElement>(null)
	const { resolvedTheme } = useTheme()

	const handlePresent = (node: React.ReactNode, newNodeId: string) => {
		setModalNode(node)
		setIsOpen(true)
		setNodeId(newNodeId)
	}

	const handleDismiss = (): any => {
		setModalNode(undefined)
		setIsOpen(false)
		setNodeId('')
	}

	const handleOverlayDismiss = e => {
		e.preventDefault()
		if (closeOnOverlayClick) {
			handleDismiss()
		}
	}

	const partial = {}
	partial['onDismiss'] = handleDismiss

	return (
		<Context.Provider
			value={{
				isOpen,
				nodeId,
				modalNode,
				setModalNode,
				onPresent: handlePresent,
				onDismiss: handleDismiss,
				setCloseOnOverlayClick
			}}
		>
			<LazyMotion features={domAnimation}>
				{/* <AnimatePresence> */}
				{isOpen && (
					<m.div
						className={clsx(styles.modalWrapper, `${resolvedTheme}--mode`)}
						ref={animationRef}
						onAnimationStart={() => {
							const element = animationRef.current
							if (!element) return
							if (element.classList.contains(styles.appear)) {
								element.classList.remove(styles.appear)
								element.classList.add(styles.disappear)
							} else {
								element.classList.remove(styles.disappear)
								element.classList.add(styles.appear)
							}
						}}
						{...animationMap}
						variants={animationVariants}
						transition={{ duration: 0.3 }}
					>
						<Overlay onClick={handleOverlayDismiss} />
						{React.isValidElement(modalNode) && React.cloneElement(modalNode, partial)}
					</m.div>
				)}
				{/* </AnimatePresence> */}
			</LazyMotion>
			{children}
		</Context.Provider>
	)
}

export default ModalProvider
