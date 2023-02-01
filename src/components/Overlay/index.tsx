import clsx from 'clsx'
import { FC, useEffect } from 'react'
import styles from './style.module.scss'

const BodyLock = () => {
	useEffect(() => {
		document.body.style.cssText = `
			overflow: hidden;
		`
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.cssText = `
				overflow: visible;
				overflow: overlay;
			`
		}
	}, [])

	return null
}

export const Overlay = props => {
	return (
		<>
			<BodyLock />
			<div
				className={clsx(styles.overlay, props.isunmounting ? styles.unmounting : styles.mounting)}
				{...props}
			/>
		</>
	)
}

export default Overlay
