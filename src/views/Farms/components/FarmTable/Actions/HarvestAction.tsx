import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import useCatchTxError from 'hooks/useCatchTxError'

import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { usePriceAstraBusd } from 'state/farms/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { FarmWithStakedValue } from '../../types'
import useHarvestFarm from '../../../hooks/useHarvestFarm'
import Skeleton from 'react-loading-skeleton'
import styles from './styles.module.scss'
import { NormalButton, withToast } from '@astraprotocol/astra-ui'
import ToastDescriptionWithTx from 'components/ToastDescriptionWithTx'
import Dots from 'components/Loader/Dots'

interface HarvestActionProps extends FarmWithStakedValue {
	userDataReady: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({ pid, userData, userDataReady }) => {
	const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
	const earningsBigNumber = new BigNumber(userData.earnings)
	const astraPrice = usePriceAstraBusd()
	let earnings = BIG_ZERO
	let earningsBusd = 0
	let displayBalance = userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />

	// If user didn't connect wallet default balance will be 0
	if (!earningsBigNumber.isZero()) {
		earnings = getBalanceAmount(earningsBigNumber)
		earningsBusd = earnings.multipliedBy(astraPrice).toNumber()
		displayBalance = earnings.toFixed(3, BigNumber.ROUND_DOWN)
	}

	const { onReward } = useHarvestFarm(pid)
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const { account } = useWeb3React()

	const disabled = earnings.eq(0) || pendingTx || !userDataReady
	return (
		<div className={styles.actionContainer}>
			<div className="flex">
				<span className="text text-sm text-bold text-uppercase secondary-color-normal padding-right-xs">
					ASA
				</span>
				<span className="text text-sm text-bold text-uppercase contrast-color-70">{t('Earned')}</span>
			</div>
			<div className="flex flex-justify-space-between flex-align-center">
				<div>
					<div className="money money-base">{displayBalance}</div>
					{earningsBusd > 0 && (
						<Balance
							className="money-xs contrast-color-70"
							decimals={2}
							value={earningsBusd}
							unit=" USD"
							prefix="~"
						/>
					)}
				</div>
				<NormalButton
					variant={disabled ? 'default' : 'primary'}
					disabled={disabled}
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
											{t('Your %symbol% earnings have been sent to your wallet!', {
												symbol: 'ASA',
											})}
										</ToastDescriptionWithTx>
									),
								},
								{ type: 'success' },
							)
							dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
						}
					}}
					// classes={{ other: 'padding-left-xs' }}
				>
					<span className="text text-base">{pendingTx ? <Dots>{t('Harvesting')}</Dots> : t('Harvest')}</span>
				</NormalButton>
			</div>
		</div>
	)
}

export default HarvestAction
