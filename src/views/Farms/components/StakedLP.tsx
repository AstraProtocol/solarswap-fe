import { BigNumber } from 'bignumber.js'
import Balance from 'components/Balance'
import { useCallback } from 'react'
import { useLpTokenPrice } from 'state/farms/hooks'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'

interface StackedLPProps {
	stakedBalance: BigNumber
	lpSymbol: string
	tokenSymbol: string
	quoteTokenSymbol: string
	lpTotalSupply: BigNumber
	tokenAmountTotal: BigNumber
	quoteTokenAmountTotal: BigNumber
}

const StakedLP: React.FunctionComponent<StackedLPProps> = ({
	stakedBalance,
	lpSymbol,
	quoteTokenSymbol,
	tokenSymbol,
	lpTotalSupply,
	tokenAmountTotal,
	quoteTokenAmountTotal
}) => {
	const lpPrice = useLpTokenPrice(lpSymbol)

	const displayBalance = useCallback(() => {
		const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
		if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
			return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN)
		}
		if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
			return getFullDisplayBalance(stakedBalance).toLocaleString()
		}
		return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
	}, [stakedBalance])

	return (
		<div className="flex col flex-align-start">
			<span className="text text-xl" color={stakedBalance.eq(0) ? 'textDisabled' : 'text'}>
				{displayBalance()}
			</span>
			{stakedBalance.gt(0) && lpPrice.gt(0) && (
				<>
					<Balance
						className="text-sm contrast-color-70"
						decimals={2}
						value={getBalanceNumber(lpPrice.times(stakedBalance))}
						unit=" USD"
						prefix="~"
					/>
					<div style={{ gap: '4px' }}>
						<Balance
							className="text-sm contrast-color-70 margin-right-xs"
							decimals={2}
							value={stakedBalance.div(lpTotalSupply).times(tokenAmountTotal).toNumber()}
							unit={` ${tokenSymbol}`}
						/>
						<Balance
							className="text-sm contrast-color-70"
							decimals={2}
							value={stakedBalance.div(lpTotalSupply).times(quoteTokenAmountTotal).toNumber()}
							unit={` ${quoteTokenSymbol}`}
						/>
					</div>
				</>
			)}
		</div>
	)
}

export default StakedLP
