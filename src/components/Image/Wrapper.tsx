import React, { forwardRef } from 'react'

import { WrapperProps } from './types'
import styles from './styles.module.scss'

// eslint-disable-next-line react/display-name
const Wrapper = forwardRef<HTMLDivElement, WrapperProps>(({ width, height, ...props }, ref) => {
	return (
		<div
			className={styles.wrapper}
			ref={ref}
			style={{
				minHeight: height,
				minWidth: width
			}}
			{...props}
		>
			{props.children}
		</div>
	)
})

export default Wrapper
