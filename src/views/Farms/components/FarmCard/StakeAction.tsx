import { useWeb3React } from '@web3-react/core'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useRouter } from 'next/router'
import { useLpTokenPrice, useFarmUser, usePriceAstraBusd } from 'state/farms/hooks'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import useUnstakeFarms from '../../hooks/useUnstakeFarms'
import useStakeFarms from '../../hooks/useStakeFarms'
import { FarmWithStakedValue } from '../types'
import StakedLP from '../StakedLP'
import ToastDescriptionWithTx from 'components/ToastDescriptionWithTx'
import { IconButton, IconEnum, NormalButton, withToast } from '@astraprotocol/astra-ui'
import { useModal } from 'components/Modal'
import styles from './styles.module.scss'

interface FarmCardActionsProps extends FarmWithStakedValue {
	lpLabel?: string
	addLiquidityUrl?: string
	displayApr?: string
}

const StakeAction: React.FC<FarmCardActionsProps> = ({
	quoteToken,
	token,
	lpSymbol,
	pid,
	multiplier,
	apr,
	displayApr,
	addLiquidityUrl,
	lpLabel,
	lpTotalSupply,
	tokenAmountTotal,
	quoteTokenAmountTotal
}) => {
	const { t } = useTranslation()
	const { onStake } = useStakeFarms(pid)
	const { onUnstake } = useUnstakeFarms(pid)
	const { tokenBalance, stakedBalance } = useFarmUser(pid)
	const astraPrice = usePriceAstraBusd()
	const router = useRouter()
	const dispatch = useAppDispatch()
	const { account } = useWeb3React()
	const lpPrice = useLpTokenPrice(lpSymbol)
	const { fetchWithCatchTxError } = useCatchTxError()

	const handleStake = async (amount: string) => {
		const receipt = await fetchWithCatchTxError(() => {
			return onStake(amount)
		})
		if (receipt?.status) {
			withToast(
				{
					title: `${t('Staked')}!`,
					moreInfo: (
						<ToastDescriptionWithTx txHash={receipt.transactionHash}>
							{t('Your funds have been staked in the farm')}
						</ToastDescriptionWithTx>
					)
				},
				{ type: 'success' }
			)
			dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
		}
	}

	const handleUnstake = async (amount: string) => {
		const receipt = await fetchWithCatchTxError(() => {
			return onUnstake(amount)
		})
		if (receipt?.status) {
			withToast(
				{
					title: `${t('Unstaked')}!`,
					moreInfo: (
						<ToastDescriptionWithTx txHash={receipt.transactionHash}>
							{t('Your earnings have also been harvested to your wallet')}
						</ToastDescriptionWithTx>
					)
				},
				{ type: 'success' }
			)

			dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
		}
	}

	const [onPresentDeposit] = useModal(
		<DepositModal
			max={tokenBalance}
			stakedBalance={stakedBalance}
			onConfirm={handleStake}
			tokenName={lpSymbol}
			multiplier={multiplier}
			lpPrice={lpPrice}
			lpLabel={lpLabel}
			apr={apr}
			displayApr={displayApr}
			addLiquidityUrl={addLiquidityUrl}
			astraPrice={astraPrice}
		/>
	)
	const [onPresentWithdraw] = useModal(
		<WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} />
	)

	const renderStakingButtons = () => {
		const disabled = ['history', 'archived'].some(item => router.pathname.includes(item))
		return stakedBalance.eq(0) ? (
			<NormalButton onClick={onPresentDeposit} disabled={disabled}>
				{t('Stake LP')}
			</NormalButton>
		) : (
			<div className={styles.iconButtonWrapper}>
				<IconButton icon={IconEnum.ICON_SUBTRACTION} onClick={onPresentWithdraw} classes="margin-right-xs" />
				<IconButton
					onClick={() => {
						if (!disabled) onPresentDeposit()
					}}
					disabled={disabled}
					icon={IconEnum.ICON_PLUS}
				/>
			</div>
		)
	}

	return (
		<div className="flex flex-justify-space-between flex-align-center">
			<StakedLP
				stakedBalance={stakedBalance}
				lpSymbol={lpSymbol}
				quoteTokenSymbol={quoteToken.symbol}
				tokenSymbol={token.symbol}
				lpTotalSupply={lpTotalSupply}
				tokenAmountTotal={tokenAmountTotal}
				quoteTokenAmountTotal={quoteTokenAmountTotal}
			/>
			{renderStakingButtons()}
		</div>
	)
}

export default StakeAction
