import { useCallback } from 'react'
import { ChainId, Currency, Token } from '@solarswap/sdk'

import { registerToken } from 'utils/wallet'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { wrappedCurrency } from 'utils/wrappedCurrency'

import { AutoColumn, ColumnCenter } from '../Layout/Column'
import { getAstraScanLink } from '../../utils'
import { InjectedModalProps, Modal } from 'components/Modal'
import { CryptoIcon, Icon, IconEnum, NormalButton, Row, Typography } from '@astraprotocol/astra-ui'

// const div = styled.div`
// 	width: 100%;
// `
// const Section = styled(AutoColumn)`
// 	padding: 24px;
// `

// const ConfirmedIcon = styled(ColumnCenter)`
// 	padding: 24px 0;
// `

function ConfirmationPendingContent({ pendingText }: { pendingText: string }) {
	const { t } = useTranslation()
	return (
		<div className="width-100">
			<div>
				{/* <Spinner /> */}
				Quay quay
			</div>
			<AutoColumn gap="12px" justify="center">
				<span className="text text-lg">{t('Waiting For Confirmation')}</span>
				<AutoColumn gap="12px" justify="center">
					<span className="text text-base bold text-center">{pendingText}</span>
				</AutoColumn>
				<span className="text text-base text-center">{t('Confirm this transaction in your wallet')}</span>
			</AutoColumn>
		</div>
	)
}

export function TransactionSubmittedContent({
	onDismiss,
	chainId,
	hash,
	currencyToAdd
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
				<div>
					<Icon icon={IconEnum.ICON_ARROW_UP} />
				</div>
				<AutoColumn gap="12px" justify="center">
					<span className="text text-base contrast-color-100">{t('Transaction Submitted')}</span>
					{chainId && hash && (
						<Typography.Link href={getAstraScanLink(hash, 'transaction', chainId)}>
							{t('View on AstraExplorer')}
						</Typography.Link>
					)}
					{currencyToAdd && library?.provider?.isMetaMask && (
						<NormalButton
							// variant="tertiary"
							// mt="12px"
							// width="fit-content"
							onClick={() => registerToken(token.address, token.symbol, token.decimals)}
						>
							<Row>
								{t('Add %asset% to Metamask', { asset: token.symbol })}
								<CryptoIcon name="metamask" size="sm" />
							</Row>
						</NormalButton>
					)}
					<NormalButton onClick={onDismiss}>{t('Close')}</NormalButton>
				</AutoColumn>
			</div>
		</div>
	)
}

export function ConfirmationModalContent({
	bottomContent,
	topContent
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
				{/* <Icon icon={IconEnum.ICON_TRASH} color="failure" width="64px" />  */}
				<span color="failure" style={{ textAlign: 'center', width: '85%', wordBreak: 'break-word' }}>
					{message}
				</span>
			</AutoColumn>

			<div className="flex flex-justify-center">
				<NormalButton onClick={onDismiss}>{t('Dismiss')}</NormalButton>
			</div>
		</div>
	)
}

interface ConfirmationModalProps {
	title: string
	customOnDismiss?: () => void
	hash: string | undefined
	content: () => React.ReactNode
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
	currencyToAdd
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
