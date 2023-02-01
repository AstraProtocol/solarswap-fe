import { useCallback } from 'react'
import { ChainId, Currency, Token } from '@solarswap/sdk'

import { registerToken } from 'utils/wallet'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { wrappedCurrency } from 'utils/wrappedCurrency'

import { AutoColumn } from '../Layout/Column'
import { getAstraExplorerLink } from '../../utils'
import { InjectedModalProps, Modal } from 'components/Modal'
import { CryptoIcon, Icon, IconEnum, NormalButton, Typography } from '@astraprotocol/astra-ui'
import Spinner from 'components/Loader/Spinner'

function ConfirmationPendingContent({ pendingText }: { pendingText: string }) {
	const { t } = useTranslation()
	return (
		<div className="width-100">
			<div className="flex flex-justify-center">
				<Spinner />
			</div>
			<AutoColumn gap="12px" justify="center">
				<span className="text text-lg">{t('Waiting For Confirmation')}</span>
				<AutoColumn gap="12px" justify="center">
					<span className="text text-base bold text-center">{pendingText}</span>
				</AutoColumn>
				<span className="text text-sm text-center contrast-color-70">
					{t('Confirm this transaction in your wallet')}
				</span>
			</AutoColumn>
		</div>
	)
}

export function TransactionSubmittedContent({
	onDismiss,
	chainId,
	hash,
	currencyToAdd,
}: {
	onDismiss: () => void
	hash: string | undefined
	chainId: ChainId
	currencyToAdd?: Currency | undefined
}) {
	const { library } = useActiveWeb3React()

	const { t } = useTranslation()

	const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId)

	return (
		<div>
			<div>
				<div className="flex flex-justify-center">
					<Icon icon={IconEnum.ICON_UP} style={{ fontSize: 90 }} classes="secondary-color-normal" />
				</div>
				<AutoColumn gap="12px" justify="center">
					<span className="text text-base contrast-color-100">{t('Transaction Submitted')}</span>
					{chainId && hash && (
						<Typography.Link target="_blank" href={getAstraExplorerLink(hash, 'transaction', chainId)}>
							{t('View on AstraExplorer')}
						</Typography.Link>
					)}
					{currencyToAdd && library?.provider?.isMetaMask && (
						<NormalButton
							classes={{ other: ' row flex-align-center' }}
							variant="default"
							onClick={() => registerToken(token.address, token.symbol, token.decimals)}
						>
							<span className="text text-sm contrast-color-70 margin-right-xs">
								{t('Add %asset% to Metamask', { asset: token.symbol })}
							</span>
							<CryptoIcon name="metamask" size="sm" />
						</NormalButton>
					)}
					<NormalButton
						classes={{ padding: 'padding-top-md padding-bottom-md padding-left-lg padding-right-lg' }}
						onClick={onDismiss}
					>
						{t('Close')}
					</NormalButton>
				</AutoColumn>
			</div>
		</div>
	)
}

export function ConfirmationModalContent({
	bottomContent,
	topContent,
}: {
	topContent: () => React.ReactNode
	bottomContent: () => React.ReactNode
}) {
	return (
		<div>
			<div>{topContent()}</div>
			<div>{bottomContent()}</div>
		</div>
	)
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
	const { t } = useTranslation()
	return (
		<div>
			<AutoColumn justify="center">
				<Icon
					icon={IconEnum.ICON_WARNING}
					classes="alert-color-error margin-bottom-md"
					style={{ fontSize: 48 }}
				/>
				<span style={{ textAlign: 'center', width: '85%', wordBreak: 'break-word' }}>{message}</span>
			</AutoColumn>

			<div className="flex flex-justify-center margin-top-md">
				<NormalButton
					classes={{ padding: 'padding-left-lg padding-right-lg padding-top-md padding-bottom-md' }}
					onClick={onDismiss}
				>
					{t('Dismiss')}
				</NormalButton>
			</div>
		</div>
	)
}

interface ConfirmationModalProps {
	title: string
	customOnDismiss?: () => void
	hash: string | undefined
	content: () => JSX.Element | JSX.Element[] | string | string[]
	attemptingTxn: boolean
	pendingText: string
	currencyToAdd?: Currency | undefined
}

const TransactionConfirmationModal: React.FC<InjectedModalProps & ConfirmationModalProps> = ({
	title,
	onDismiss,
	customOnDismiss,
	attemptingTxn,
	hash,
	pendingText,
	content,
	currencyToAdd,
}) => {
	const { chainId } = useActiveWeb3React()

	const handleDismiss = useCallback(() => {
		if (customOnDismiss) {
			customOnDismiss()
		}
		onDismiss?.()
	}, [customOnDismiss, onDismiss])

	if (!chainId) return null

	return (
		<Modal title={title} headerBackground="gradients.cardHeader" onDismiss={handleDismiss}>
			{attemptingTxn ? (
				<ConfirmationPendingContent pendingText={pendingText} />
			) : hash ? (
				<TransactionSubmittedContent
					chainId={chainId}
					hash={hash}
					onDismiss={handleDismiss}
					currencyToAdd={currencyToAdd}
				/>
			) : (
				content()
			)}
		</Modal>
	)
}

export default TransactionConfirmationModal
