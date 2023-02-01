import { IconButton, IconEnum } from '@astraprotocol/astra-ui'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
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
	const { resolvedTheme } = useTheme()

	useOnClickOutside(ref, () => setIsOpen(false))

	if (!shouldRender || !isMobile) {
		return null
	}

	const portal = getPortalRoot()

	if (portal)
		return createPortal(
			<div className={`${resolvedTheme}--mode`}>
				<Overlay isunmounting={!isOpen} />
				<div
					role="presentation"
					className={clsx(styles.drawContainer, isOpen ? styles.mounting : styles.unmounting)}
					ref={ref}
				>
					<div style={{ position: 'absolute', right: 20, top: 20 }}>
						<IconButton size="xl" icon={IconEnum.ICON_CLOSE} onClick={() => setIsOpen(false)} />
					</div>
					{content}
				</div>
			</div>,
			portal,
		)
	return null
}

export default BottomDrawer
