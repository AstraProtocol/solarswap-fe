import { AnimatePresence, m, Variants, LazyMotion, domAnimation } from 'framer-motion'
import React, { createContext, useState, useRef } from 'react'
import { Handler } from './types'
import styles from './style.module.scss'
import Overlay from 'components/Overlay'

// const animationMap = {
// 	initial: 'initial',
// 	animate: 'animate',
// 	exit: 'exit'
// }
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

const ModalProvider: React.FC = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [modalNode, setModalNode] = useState<React.ReactNode>()
	const [nodeId, setNodeId] = useState('')
	const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true)
	const animationRef = useRef<HTMLDivElement>(null)

	const handlePresent = (node: React.ReactNode, newNodeId: string) => {
		setModalNode(node)
		setIsOpen(true)
		setNodeId(newNodeId)
	}

	const handleDismiss = () => {
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
				<AnimatePresence>
					{isOpen && (
						<div
							id="test"
							className={styles.modalWrapper}
							ref={animationRef}
							onAnimationStart={() => {
								const element = animationRef.current
								if (!element) return
								if (element.classList.contains('appear')) {
									element.classList.remove('appear')
									element.classList.add('disappear')
								} else {
									element.classList.remove('disappear')
									element.classList.add('appear')
								}
							}}
							// {...animationMap}
						>
							<Overlay onClick={handleOverlayDismiss} />
							{React.isValidElement(modalNode) &&
								React.cloneElement(modalNode, {
									onDismiss: handleDismiss
								})}
						</div>
					)}
				</AnimatePresence>
			</LazyMotion>
			{children}
		</Context.Provider>
	)
}

export default ModalProvider
