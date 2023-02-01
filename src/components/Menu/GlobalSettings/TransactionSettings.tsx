import { useState } from 'react'
import { escapeRegExp } from 'utils'

import { useTranslation } from 'contexts/Localization'
import { useUserSlippageTolerance, useUserTransactionTTL } from 'state/user/hooks'
import QuestionHelper from '../../QuestionHelper'
import { Form, NormalButton } from '@astraprotocol/astra-ui'

enum SlippageError {
	InvalidInput = 'InvalidInput',
	RiskyLow = 'RiskyLow',
	RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
	InvalidInput = 'InvalidInput',
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
const THREE_DAYS_IN_SECONDS = 60 * 60 * 24 * 3

const SlippageTabs = () => {
	const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()
	const [ttl, setTtl] = useUserTransactionTTL()
	const [slippageInput, setSlippageInput] = useState('')
	const [deadlineInput, setDeadlineInput] = useState('')

	const { t } = useTranslation()

	const slippageInputIsValid =
		slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
	const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput

	let slippageError: SlippageError | undefined
	if (slippageInput !== '' && !slippageInputIsValid) {
		slippageError = SlippageError.InvalidInput
	} else if (slippageInputIsValid && userSlippageTolerance < 50) {
		slippageError = SlippageError.RiskyLow
	} else if (slippageInputIsValid && userSlippageTolerance > 500) {
		slippageError = SlippageError.RiskyHigh
	} else {
		slippageError = undefined
	}

	let deadlineError: DeadlineError | undefined
	if (deadlineInput !== '' && !deadlineInputIsValid) {
		deadlineError = DeadlineError.InvalidInput
	} else {
		deadlineError = undefined
	}

	const parseCustomSlippage = (value: string) => {
		if (value === '' || inputRegex.test(escapeRegExp(value))) {
			setSlippageInput(value)

			try {
				const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
				if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
					setUserSlippageTolerance(valueAsIntFromRoundedFloat)
				}
			} catch (error) {
				console.error(error)
			}
		}
	}

	const parseCustomDeadline = (value: string) => {
		setDeadlineInput(value)

		try {
			const valueAsInt: number = Number.parseInt(value) * 60
			if (!Number.isNaN(valueAsInt) && valueAsInt > 60 && valueAsInt < THREE_DAYS_IN_SECONDS) {
				setTtl(valueAsInt)
			} else {
				deadlineError = DeadlineError.InvalidInput
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="flex col">
			<div className="flex col margin-bottom-sm">
				<div className="flex flex-wrap flex-align-center margin-bottom-sm">
					<span className="text text-base text-bold  margin-right-xs">{t('Slippage Tolerance')}</span>
					<QuestionHelper
						text={t(
							'Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.',
						)}
						placement="top"
					/>
				</div>
				<div className="flex flex-wrap flex-align-center">
					<NormalButton
						onClick={() => {
							setSlippageInput('')
							setUserSlippageTolerance(10)
						}}
						variant={userSlippageTolerance === 10 ? 'primary' : 'default'}
					>
						<span className="text text-sm">0.1%</span>
					</NormalButton>
					<NormalButton
						onClick={() => {
							setSlippageInput('')
							setUserSlippageTolerance(50)
						}}
						classes={{ other: 'margin-left-xs' }}
						variant={userSlippageTolerance === 50 ? 'primary' : 'default'}
					>
						<span className="text text-sm">0.5%</span>
					</NormalButton>
					<NormalButton
						onClick={() => {
							setSlippageInput('')
							setUserSlippageTolerance(100)
						}}
						classes={{ other: 'margin-left-xs' }}
						variant={userSlippageTolerance === 100 ? 'primary' : 'default'}
					>
						<span className="text text-sm">1.0%</span>
					</NormalButton>
					<Form.Input
						classes={{
							wapper: 'margin-left-xs',
							option: 'x',
							inputWrapperPadding: 'padding-sm',
						}}
						inputMode="decimal"
						pattern="^[0-9]*[.,]?[0-9]{0,2}$"
						placeholder={(userSlippageTolerance / 100).toFixed(2)}
						value={slippageInput}
						onBlur={() => {
							parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
						}}
						onChange={event => {
							if (event.currentTarget.validity.valid) {
								parseCustomSlippage(event.target.value.replace(/,/g, '.'))
							}
						}}
						style={{ width: '40px' }}
						suffixElement="%"
						statusType={slippageInputIsValid ? 'normal' : 'error'}
						// isSuccess={![10, 50, 100].includes(userSlippageTolerance)}
					/>
				</div>
				{!!slippageError && (
					<span className="text text-sm alert-color-error margin-top-xs">
						{slippageError === SlippageError.InvalidInput
							? t('Enter a valid slippage percentage')
							: slippageError === SlippageError.RiskyLow
							? t('Your transaction may fail')
							: t('Your transaction may be frontrun')}
					</span>
				)}
			</div>
			<div className="flex flex-justify-space-between flex-align-center">
				<div className="flex flex-align-center">
					<span className="text text-base text-bold margin-right-xs">{t('Tx deadline (mins)')}</span>
					<QuestionHelper
						text={t('Your transaction will revert if it is left confirming for longer than this time.')}
						placement="top"
					/>
				</div>
				<div>
					<Form.Input
						inputMode="numeric"
						pattern="^[0-9]+$"
						classes={{
							inputWrapperPadding: 'padding-top-xs padding-bottom-xs padding-left-md padding-right-md',
							option: '.',
						}}
						// color={deadlineError ? 'red' : undefined}
						// isWarning={!!deadlineError}
						onBlur={() => {
							parseCustomDeadline((ttl / 60).toString())
						}}
						placeholder={(ttl / 60).toString()}
						value={deadlineInput}
						onChange={event => {
							if (event.currentTarget.validity.valid) {
								parseCustomDeadline(event.target.value)
							}
						}}
						style={{ width: 22 }}
					/>
				</div>
			</div>
		</div>
	)
}

export default SlippageTabs
