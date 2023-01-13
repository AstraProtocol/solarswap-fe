import { NormalButton, withToast } from '@astraprotocol/astra-ui'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import Dots from 'components/Loader/Dots'
import ToastDescriptionWithTx from 'components/ToastDescriptionWithTx'
import { useTranslation } from 'contexts/Localization'
import useCatchTxError from 'hooks/useCatchTxError'

import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { usePriceAstraBusd } from 'state/farms/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import useHarvestFarm from '../../hooks/useHarvestFarm'

interface FarmCardActionsProps {
	earnings?: BigNumber
	pid?: number
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid }) => {
	const { account } = useWeb3React()
	const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
	const { t } = useTranslation()
	const { onReward } = useHarvestFarm(pid)
	const astraPrice = usePriceAstraBusd()
	const dispatch = useAppDispatch()
	const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
	const displayBalance = rawEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN)
	const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(astraPrice).toNumber() : 0

	return (
		<div className="flex flex-justify-space-between flex-align-center">
			<div className="flex col flex-align-start">
				<span className="text text-xl" color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>
					{displayBalance}
				</span>
				{earningsBusd > 0 && (
					<Balance
						className="money-sm contrast-color-70"
						decimals={2}
						value={earningsBusd}
						unit=" USD"
						prefix="~"
					/>
				)}
			</div>
			<NormalButton
				variant="default"
				disabled={rawEarningsBalance.eq(0) || pendingTx}
				onClick={async () => {
					const receipt = await fetchWithCatchTxError(() => {
						return onReward()
					})
					if (receipt?.status) {
						withToast(
							{
								title: `${t('Harvested')}!`,
								moreInfo: (
									<ToastDescriptionWithTx txHash={receipt.transactionHash}>
										{t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'ASA' })}
									</ToastDescriptionWithTx>
								)
							},
							{ type: 'success' }
						)
						dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
					}
				}}
			>
				<span className="text text-base">{pendingTx ? <Dots>{t('Harvesting')}</Dots> : t('Harvest')}</span>
			</NormalButton>
		</div>
	)
}

export default HarvestAction
