import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getAstraExplorerLink } from 'utils'
import { TransactionDetails } from 'state/transactions/reducer'
import { Icon, IconEnum, Typography } from '@astraprotocol/astra-ui'
import CircleLoader from 'components/Loader/CircleLoader'

export default function Transaction({ tx }: { tx: TransactionDetails }) {
	const { chainId } = useActiveWeb3React()

	const summary = tx?.summary
	const pending = !tx?.receipt
	const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')

	if (!chainId) return null

	return (
		<div>
			<Typography.Link target="_blank" href={getAstraExplorerLink(tx.hash, 'transaction', chainId)}>
				{summary ?? tx.hash}
			</Typography.Link>

			<span className="margin-left-xs">
				{pending ? (
					<CircleLoader />
				) : success ? (
					<Icon icon={IconEnum.ICON_CHECKED} className="alert-color-success" />
				) : (
					<Icon icon={IconEnum.ICON_CLOSE} className="alert-color-error" />
				)}
			</span>
		</div>
	)
}
