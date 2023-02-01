import React from 'react'
import { Form } from '@astraprotocol/astra-ui'
import { TextfieldProps } from './types'
import styles from './styles.module.scss'

const Textfield: React.FC<TextfieldProps> = ({
	label,
	value,
	placeholder,
	onUserInput,
	inputProps,
	isWarning = false,
}) => {
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onUserInput(e.target.value)
	}

	return (
		<div className={styles.balanceInputContainer}>
			<span className="text text-sm">{label}</span>
			<Form.Input
				className={styles.input}
				value={value}
				onChange={handleOnChange}
				placeholder={placeholder}
				{...inputProps}
			/>
		</div>
	)
}

export default Textfield
