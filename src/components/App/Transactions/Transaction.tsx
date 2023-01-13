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
			<Typography.Link href={getAstraExplorerLink(tx.hash, 'transaction', chainId)}>
				{summary ?? tx.hash}
			</Typography.Link>

			{pending ? (
				<CircleLoader />
			) : success ? (
				<Icon icon={IconEnum.ICON_CHECKED} color="success" />
			) : (
				<Icon icon={IconEnum.ICON_CLOSE} color="failure" />
			)}
		</div>
	)
}
