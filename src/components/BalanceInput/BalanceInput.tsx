import { Form, IconButton, IconEnum } from '@astraprotocol/astra-ui'
import React from 'react'
import { BalanceInputProps } from './types'
import styles from './styles.module.scss'
import clsx from 'clsx'

const BalanceInput: React.FC<BalanceInputProps> = ({
	value,
	placeholder = '0.0',
	onUserInput,
	currencyValue,
	inputProps,
	innerRef,
	isWarning = false,
	decimals = 18,
	unit,
	switchEditingUnits,
	...props
}) => {
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.currentTarget.validity.valid) {
			onUserInput(e.currentTarget.value.replace(/,/g, '.'))
		}
	}

	return (
		<div className={clsx(styles.balanceInputContainer, 'row same-bg-color-70')} {...props}>
			<div className="col">
				<div className="row flex-align-center flex-justify-end">
					<input
						className={clsx(styles.input, 'money money-sm width-100')}
						pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
						inputMode="decimal"
						min="0"
						value={value}
						autoFocus={false}
						onChange={handleOnChange}
						placeholder={placeholder}
						ref={innerRef}
						{...inputProps}
					/>
					{unit && (
						<span className={clsx(styles.unitContainer, 'text text-sm contrast-color-70')}>{unit}</span>
					)}
				</div>
				{currencyValue && <span className="text text-sm text-right contrast-color-70">{currencyValue}</span>}
			</div>
			<div className="flex flex-align-center ">
				{switchEditingUnits && (
					<IconButton
						color="#6535e9"
						classes={clsx(styles.switchUnitsButton, 'padding-left-xs ')}
						icon={IconEnum.ICON_SWAP_TOP_DOWN}
						onClick={switchEditingUnits}
					/>
				)}
			</div>
		</div>
	)
}

export default BalanceInput
