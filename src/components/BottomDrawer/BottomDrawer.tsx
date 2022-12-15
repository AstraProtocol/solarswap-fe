import { IconButton, IconEnum } from '@astraprotocol/astra-ui'
import clsx from 'clsx'
import React, { useRef } from 'react'
import { createPortal } from 'react-dom'
import getPortalRoot from 'utils/ui/getPortalRoot'
import useDelayedUnmount from '../../hooks/useDelayedUnmount'
import useMatchBreakpoints from '../../hooks/useMatchBreakpoints'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import { Overlay } from '../Overlay'

import styles from './styles.module.scss'

interface BottomDrawerProps {
	content: React.ReactNode
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ content, isOpen, setIsOpen }) => {
	const ref = useRef<HTMLDivElement>(null)
	const shouldRender = useDelayedUnmount(isOpen, 350)
	const { isMobile } = useMatchBreakpoints()

	useOnClickOutside(ref, () => setIsOpen(false))

	if (!shouldRender || !isMobile) {
		return null
	}

	const portal = getPortalRoot()

	if (portal)
		return createPortal(
			<>
				<Overlay isUnmounting={!isOpen} />
				<div className={clsx(styles.drawContainer, isOpen ? styles.mounting : styles.unmounting)} ref={ref}>
					<div style={{ position: 'absolute', right: 16, top: 0 }}>
						<IconButton icon={IconEnum.ICON_CLOSE} onClick={() => setIsOpen(false)} />
					</div>
					{content}
				</div>
			</>,
			portal
		)
	return null
}

export default BottomDrawer
