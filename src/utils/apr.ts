/**
 * @fileoverview Tien 02/12/2022
 */
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, ASA_PER_YEAR } from 'config'
import lpAprs from 'config/constants/lpAprs.json'

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
	stakingTokenPrice: number,
	rewardTokenPrice: number,
	totalStaked: number,
	tokenPerBlock: number
): number => {
	const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
	const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
	const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
	return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param astraPriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
	poolWeight: BigNumber,
	astraPriceUsd: BigNumber,
	poolLiquidityUsd: BigNumber,
	farmAddress: string
): { asaRewardsApr: number; lpRewardsApr: number } => {
	const yearlyCakeRewardAllocation = poolWeight ? poolWeight.times(ASA_PER_YEAR) : new BigNumber(NaN)
	const asaRewardsApr = yearlyCakeRewardAllocation.times(astraPriceUsd).div(poolLiquidityUsd).times(100)
	let asaRewardsAprAsNumber = null
	if (!asaRewardsApr.isNaN() && asaRewardsApr.isFinite()) {
		asaRewardsAprAsNumber = asaRewardsApr.toNumber()
	}
	const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
	return { asaRewardsApr: asaRewardsAprAsNumber, lpRewardsApr }
}
