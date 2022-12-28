import React from 'react'
import { AstraIcon } from 'components/Logo'
import styles from './styles.module.scss'

const Spinner = ({ size = 128 }) => {
	return (
		<div style={{ position: 'relative' }}>
			<AstraIcon className={styles.astraSpinner} height={`${size * 0.5}px`} width={`${size * 0.5}px`} />
		</div>
	)
}

export default Spinner
