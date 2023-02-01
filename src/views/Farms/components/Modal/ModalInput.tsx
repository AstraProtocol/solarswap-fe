import { useTranslation } from 'contexts/Localization'
import { parseUnits } from '@ethersproject/units'
import { formatBigNumber } from 'utils/formatBalance'
import { Form, NormalButton, Typography } from '@astraprotocol/astra-ui'
import styles from './styles.module.scss'
import clsx from 'clsx'

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
}

const ModalInput: React.FC<ModalInputProps> = ({
	max,
	symbol,
	onChange,
	onSelectMax,
	value,
	addLiquidityUrl,
	inputTitle,
	decimals = 18,
}) => {
	const { t } = useTranslation()
	const isBalanceZero = max === '0' || !max

	const displayBalance = (balance: string) => {
		if (isBalanceZero) {
			return '0'
		}

		const balanceUnits = parseUnits(balance, decimals)
		return formatBigNumber(balanceUnits, decimals, decimals)
	}

	return (
		<div style={{ position: 'relative' }}>
			<div className={styles.tokenInput}>
				<div className="flex flex-justify-space-between padding-left-md margin-bottom-sm">
					<span className="text text-sm">{inputTitle}</span>
					<span className="text text-sm">
						{t('Balance')}:<span className="money money-sm margin-left-xs">{displayBalance(max)}</span>
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
					/>
					<NormalButton onClick={onSelectMax}>
						<span className="text">{t('Max')}</span>
					</NormalButton>
					<span className="text text-base margin-left-xs">{symbol}</span>
				</div>
			</div>
			{isBalanceZero && (
				<div className={clsx(styles.errorMessage, 'text text-sm alert-color-error')}>
					<span>{t('No tokens to stake')}: </span>
					<Typography.Link
						fontSize="text-sm"
						classes="alert-color-error"
						href={addLiquidityUrl}
						target="_blank"
					>
						{t('Get %symbol%', { symbol })}
					</Typography.Link>
				</div>
			)}
		</div>
	)
}

export default ModalInput
