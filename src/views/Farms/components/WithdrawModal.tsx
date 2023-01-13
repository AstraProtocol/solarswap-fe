import BigNumber from 'bignumber.js'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { Modal } from 'components/Modal'
import { NormalButton } from '@astraprotocol/astra-ui'
import ModalActions from './Modal/ModalActions'
import ModalInput from './Modal/ModalInput'
import Dots from 'components/Loader/Dots'

interface WithdrawModalProps {
	max: BigNumber
	onConfirm: (amount: string) => void
	onDismiss?: () => void
	tokenName?: string
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '' }) => {
	const [val, setVal] = useState('')
	const [pendingTx, setPendingTx] = useState(false)
	const { t } = useTranslation()
	const fullBalance = useMemo(() => {
		return getFullDisplayBalance(max)
	}, [max])

	const valNumber = new BigNumber(val)
	const fullBalanceNumber = new BigNumber(fullBalance)

	const handleChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			if (e.currentTarget.validity.valid) {
				setVal(e.currentTarget.value.replace(/,/g, '.'))
			}
		},
		[setVal]
	)

	const handleSelectMax = useCallback(() => {
		setVal(fullBalance)
	}, [fullBalance, setVal])

	return (
		<Modal title={t('Unstake LP tokens')} style={{ minWidth: 470 }} onDismiss={onDismiss}>
			<ModalInput
				onSelectMax={handleSelectMax}
				onChange={handleChange}
				value={val}
				max={fullBalance}
				symbol={tokenName}
				inputTitle={t('Unstake')}
			/>
			<div className="margin-top-lg" />
			<ModalActions>
				<NormalButton
					variant="default"
					onClick={onDismiss}
					classes={{ other: 'width-100' }}
					disabled={pendingTx}
				>
					<span className="text text-base">{t('Cancel')}</span>
				</NormalButton>
				<NormalButton
					disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
					onClick={async () => {
						setPendingTx(true)
						await onConfirm(val)
						onDismiss?.()
						setPendingTx(false)
					}}
					classes={{ other: 'width-100' }}
				>
					<span className="text text-base">{pendingTx ? <Dots>{t('Confirming')}</Dots> : t('Confirm')}</span>
				</NormalButton>
			</ModalActions>
		</Modal>
	)
}

export default WithdrawModal
