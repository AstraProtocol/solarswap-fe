import { Fragment, memo } from 'react'
import { Trade } from '@solarswap/sdk'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { Icon, IconEnum } from '@astraprotocol/astra-ui'

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
	return (
		<div className="flex flex-wrap flex-justify-end flex-align-center width-100">
			{trade.route.path.map((token, i, path) => {
				const isLastItem: boolean = i === path.length - 1
				const currency = unwrappedToken(token)
				return (
					// eslint-disable-next-line react/no-array-index-key
					<Fragment key={i}>
						<div className="flex flex-align-end">
							<span className="text text-base">{currency.symbol}</span>
						</div>
						{!isLastItem && <Icon icon={IconEnum.ICON_ARROW_RIGHT} />}
					</Fragment>
				)
			})}
		</div>
	)
})
