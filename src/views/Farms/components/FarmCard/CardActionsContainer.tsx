// import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
// import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { getAddress } from 'utils/addressHelpers'
import { FarmWithStakedValue } from '../types'
import useApproveFarm from '../../hooks/useApproveFarm'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'
import { NormalButton, withToast } from '@astraprotocol/astra-ui'
import ToastDescriptionWithTx from 'components/ToastDescriptionWithTx'
import ButtonConnect from 'components/ButtonConnect'

interface FarmCardActionsProps {
	farm: FarmWithStakedValue
	account?: string
	addLiquidityUrl?: string
	lpLabel?: string
	displayApr?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl, lpLabel, displayApr }) => {
	const { t } = useTranslation()
	const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
	const { pid, lpAddresses } = farm
	const { allowance, earnings } = farm.userData || {}
	const lpAddress = getAddress(lpAddresses)
	const isApproved = account && allowance && allowance.isGreaterThan(0)
	const dispatch = useAppDispatch()

	const lpContract = useERC20(lpAddress)

	const { onApprove } = useApproveFarm(lpContract)

	const handleApprove = useCallback(async () => {
		const receipt = await fetchWithCatchTxError(() => {
			return onApprove()
		})
		if (receipt?.status) {
			withToast(
				{
					title: t('Contract Enabled'),
					moreInfo: <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
				},
				{ type: 'success' },
			)
			dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
		}
	}, [onApprove, dispatch, account, pid, t, fetchWithCatchTxError])

	const renderApprovalOrStakeButton = () => {
		return isApproved ? (
			<StakeAction {...farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} displayApr={displayApr} />
		) : (
			<NormalButton classes={{ other: 'margint-op-xs width-100' }} disabled={pendingTx} onClick={handleApprove}>
				{t('Enable Contract')}
			</NormalButton>
		)
	}

	return (
		<div className="margin-top-md">
			<div className="flex">
				<span className="text text-xs text-bold text-uppercase padding-right-xs secondary-color-normal">
					ASA
				</span>
				<span className="text text-xs text-bold text-uppercase contrast-color-70">{t('Earned')}</span>
			</div>
			<HarvestAction earnings={earnings} pid={pid} />
			<div className="flex margin-bottom-md">
				<span className="text text-xs text-bold text-uppercase padding-right-xs secondary-color-normal">
					{farm.lpSymbol}
				</span>
				<span className="text text-xs text-bold text-uppercase contrast-color-70">{t('Staked')}</span>
			</div>
			{!account ? <ButtonConnect classes="width-100 margin-top-xs" /> : renderApprovalOrStakeButton()}
		</div>
	)
}

export default CardActions
