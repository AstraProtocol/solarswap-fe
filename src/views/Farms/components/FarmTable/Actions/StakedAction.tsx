import { useWeb3React } from '@web3-react/core'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useFarmUser, useLpTokenPrice, usePriceAstraBusd } from 'state/farms/hooks'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import useApproveFarm from '../../../hooks/useApproveFarm'
import useStakeFarms from '../../../hooks/useStakeFarms'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'
import DepositModal from '../../DepositModal'
import WithdrawModal from '../../WithdrawModal'

import { FarmWithStakedValue } from '../../types'
import StakedLP from '../../StakedLP'
import ToastDescriptionWithTx from 'components/ToastDescriptionWithTx'
import { useModal } from 'components/Modal'
import { IconButton, IconEnum, NormalButton, Spinner, withToast } from '@astraprotocol/astra-ui'
import ButtonConnect from 'components/ButtonConnect'
import styles from './styles.module.scss'
import Skeleton from 'react-loading-skeleton'

interface StackedActionProps extends FarmWithStakedValue {
	userDataReady: boolean
	lpLabel?: string
	displayApr?: string
}

const Staked: React.FunctionComponent<StackedActionProps> = ({
	pid,
	apr,
	multiplier,
	lpSymbol,
	lpLabel,
	lpAddresses,
	quoteToken,
	token,
	userDataReady,
	displayApr,
	lpTotalSupply,
	tokenAmountTotal,
	quoteTokenAmountTotal
}) => {
	const { t } = useTranslation()
	const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
	const { account } = useWeb3React()
	const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid)
	const { onStake } = useStakeFarms(pid)
	const { onUnstake } = useUnstakeFarms(pid)
	const router = useRouter()
	const lpPrice = useLpTokenPrice(lpSymbol)
	const astraPrice = usePriceAstraBusd()

	const isApproved = account && allowance && allowance.isGreaterThan(0)

	const lpAddress = getAddress(lpAddresses)
	const liquidityUrlPathParts = getLiquidityUrlPathParts({
		quoteTokenAddress: quoteToken.address,
		tokenAddress: token.address
	})
	const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

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
			lpPrice={lpPrice}
			lpLabel={lpLabel}
			apr={apr}
			displayApr={displayApr}
			stakedBalance={stakedBalance}
			onConfirm={handleStake}
			tokenName={lpSymbol}
			multiplier={multiplier}
			addLiquidityUrl={addLiquidityUrl}
			astraPrice={astraPrice}
		/>
	)
	const [onPresentWithdraw] = useModal(
		<WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} />
	)
	const lpContract = useERC20(lpAddress)
	const dispatch = useAppDispatch()
	const { onApprove } = useApproveFarm(lpContract)

	const handleApprove = useCallback(async () => {
		const receipt = await fetchWithCatchTxError(() => {
			return onApprove()
		})
		if (receipt?.status) {
			withToast(
				{ title: t('Contract Enabled'), moreInfo: <ToastDescriptionWithTx txHash={receipt.transactionHash} /> },
				{ type: 'success' }
			)
			dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
		}
	}, [onApprove, dispatch, account, pid, t, fetchWithCatchTxError])

	if (!account) {
		return (
			<div className={styles.actionContainer}>
				<div className="flex">
					<span className="text text-sm text-bold text-uppercase contrast-color-70">
						{t('Start Farming')}
					</span>
				</div>
				<div className="flex flex-justify-space-between flex-align-center">
					<ButtonConnect classes="width-100" />
				</div>
			</div>
		)
	}

	if (isApproved) {
		if (stakedBalance.gt(0)) {
			return (
				<div className={styles.actionContainer}>
					<div className="flex">
						<span className="text text-sm text-uppercase text-bold padding-right-xs">{lpSymbol}</span>
						<span className="text text-sm text-bold text-uppercase contrast-color-70">{t('Staked')}</span>
					</div>
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
						<div className="flex">
							<div className="padding-sm border border-base radius-lg margin-right-xs alert-bd-color-info">
								<IconButton icon={IconEnum.ICON_SUBTRACTION} classes="" onClick={onPresentWithdraw} />
							</div>
							<div className="padding-sm border border-base radius-lg margin-right-xs alert-bd-color-info">
								<IconButton
									icon={IconEnum.ICON_PLUS}
									onClick={onPresentDeposit}
									disabled={['history', 'archived'].some(item => router.pathname.includes(item))}
								/>
							</div>
						</div>
					</div>
				</div>
			)
		}

		return (
			<div className={styles.actionContainer}>
				<div className="flex">
					<span className="text text-sm text-bold text-uppercase padding-right-xs contrast-color-70">
						{t('Stake')}
					</span>
					<span className="text text-sm text-bold text-uppercase secondary-color-normal">{lpSymbol}</span>
				</div>
				<div className="flex flex-justify-space-between flex-align-center">
					<NormalButton
						classes={{ other: 'width-100' }}
						onClick={onPresentDeposit}
						disabled={['history', 'archived'].some(item => router.pathname.includes(item))}
					>
						<span className="text text-base">{t('Stake LP')}</span>
					</NormalButton>
				</div>
			</div>
		)
	}

	if (!userDataReady) {
		return (
			<div className={styles.actionContainer}>
				<div className="flex">
					<span className="text text-sm text-bold text-uppercase contrast-color-70">
						{t('Start Farming')}
					</span>
				</div>
				<div className="flex flex-justify-space-between flex-align-center">
					<Skeleton width={180} />
				</div>
			</div>
		)
	}

	return (
		<div className={styles.actionContainer}>
			<div className="flex">
				<span className="text text-sm text-bold text-uppercase contrast-color-70 margin-bottom-xs">
					{t('Enable Farm')}
				</span>
			</div>
			<div className="flex flex-justify-space-between flex-align-center">
				<NormalButton
					classes={{ other: 'width-100 row flex-justify-center' }}
					disabled={pendingTx}
					onClick={handleApprove}
				>
					<span className="text text-base  margin-right-sm">{t('Enable')}</span>
					{pendingTx && <Spinner />}
				</NormalButton>
			</div>
		</div>
	)
}

export default Staked
