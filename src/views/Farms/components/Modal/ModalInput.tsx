import { useTranslation } from 'contexts/Localization'
import { formatEther, parseUnits } from '@ethersproject/units'
import { formatBigNumber } from 'utils/formatBalance'
import { Form, NormalButton, Typography } from '@astraprotocol/astra-ui'
import styles from './styles.module.scss'
import clsx from 'clsx'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

interface ModalInputProps {
	max: string
	symbol: string
	onSelectMax?: () => void
	onChange: (e: React.FormEvent<HTMLInputElement>) => void
	placeholder?: string
	value: string
	addLiquidityUrl?: string
	inputTitle?: string
	decimals?: number
	allowance?: BigNumber
}

const ModalInput: React.FC<ModalInputProps> = ({
	max,
	symbol,
	onChange,
	onSelectMax,
	value,
	addLiquidityUrl,
	inputTitle,
	allowance,
	decimals = 18,
}) => {
	const { t } = useTranslation()
	const { isMobile } = useMatchBreakpoints()
	const allowanceString = allowance ? formatEther(allowance.toString()) : '0'
	const isOverAllowance = value && allowance && parseFloat(value) > parseFloat(allowanceString)
	const isBalanceZero = max === '0' || !max

	const displayBalance = (balance: string) => {
		if (isBalanceZero) {
			return '0'
		}

		const balanceUnits = parseUnits(balance, decimals)
		return formatBigNumber(balanceUnits, decimals, decimals)
	}

	const getErrorMessage = useMemo(() => {
		if (isBalanceZero) return t('No tokens to stake')
		if (value && parseFloat(value) > parseFloat(max)) return t('Insufficient %symbol% balance', { symbol })
		if (isOverAllowance) return t('Your approve current is not enough')
		return ''
	}, [isBalanceZero, t, isOverAllowance, value, max, symbol])

	return (
		<div style={{ position: 'relative' }}>
			<div className={styles.tokenInput}>
				<div className="flex  padding-left-md margin-bottom-sm">
					<span className="text text-base">{t('Balance')}:</span>
					<span className="text text-base margin-left-xs">{displayBalance(max)}</span>
				</div>
				<div className="flex  padding-left-md margin-bottom-sm">
					<span className="text text-base">{t('Approved')}:</span>
					<span className="text text-base margin-left-xs">
						{allowance ? (parseInt(allowanceString) > 10 ** 10 ? t('Infinity') : allowanceString) : ''}
					</span>
				</div>

				<div className="flex flex-align-end flex-justify-space-around">
					<Form.Input
						className={styles.input}
						pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
						inputMode="decimal"
						step="any"
						min="0"
						classes={{ option: ' ', inputWrapperPadding: 'padding-xs' }}
						onChange={onChange}
						placeholder="0"
						value={value}
						// disabled={isBalanceZero}
						style={{ maxWidth: isMobile ? 120 : 1000 }}
						suffixElement={
							<div style={{ width: 50 }}>
								<a
									onClick={onSelectMax}
									className="text text-sm secondary-color-normal font-700 pointer"
								>
									{t('Max')}
								</a>
							</div>
						}
					/>
					<span className="text text-base margin-left-xs">{symbol}</span>
				</div>
			</div>
			<div className={clsx(styles.errorMessage, 'text text-sm alert-color-error ')}>
				<span>{getErrorMessage}</span>
			</div>
		</div>
	)
}

export default ModalInput
