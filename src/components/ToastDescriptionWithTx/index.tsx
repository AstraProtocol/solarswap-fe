import { getAstraExplorerLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import truncateHash from 'utils/truncateHash'

interface DescriptionWithTxProps {
	description?: string
	txHash?: string
	children?: JSX.Element | JSX.Element[] | string | string[]
}

const ToastDescriptionWithTx: React.FC<DescriptionWithTxProps> = ({ txHash, children }) => {
	const { chainId } = useActiveWeb3React()
	const { t } = useTranslation()

	return (
		<>
			{typeof children === 'string' ? <div className="text text-base">{children}</div> : children}
			{txHash && (
				<a
					target="_blank"
					rel="noreferrer noopener"
					href={getAstraExplorerLink(txHash, 'transaction', chainId)}
				>
					{t('View on AstraExplorer')}: {truncateHash(txHash, 8, 0)}
				</a>
			)}
		</>
	)
}

export default ToastDescriptionWithTx
