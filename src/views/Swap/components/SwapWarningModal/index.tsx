import { useEffect } from 'react'

import { useTranslation } from 'contexts/Localization'
import { WrappedTokenInfo } from 'state/lists/hooks'
import SwapWarningTokensConfig from 'config/constants/swapWarningTokens'
import styles from './style.module.scss'

import Acknowledgement from './Acknowledgement'
import { Modal } from 'components/Modal'

interface SwapWarningModalProps {
	swapCurrency: WrappedTokenInfo
	onDismiss?: () => void
}

// Modal is fired by a useEffect and doesn't respond to closeOnOverlayClick prop being set to false
const usePreventModalOverlayClick = () => {
	useEffect(() => {
		const preventClickHandler = e => {
			e.stopPropagation()
			e.preventDefault()
			return false
		}

		document.querySelectorAll('[role="presentation"]').forEach(el => {
			el.addEventListener('click', preventClickHandler, true)
		})

		return () => {
			document.querySelectorAll('[role="presentation"]').forEach(el => {
				el.removeEventListener('click', preventClickHandler, true)
			})
		}
	}, [])
}

const SwapWarningModal: React.FC<SwapWarningModalProps> = ({ swapCurrency, onDismiss }) => {
	const { t } = useTranslation()

	usePreventModalOverlayClick()

	// Currently, we don't have any warning tokens. So, pre-define here as an example
	const TOKEN_WARNINGS = {
		// [SwapWarningTokensConfig.bttold.address]: {
		//   symbol: SwapWarningTokensConfig.bttold.symbol,
		//   component: <BTTWarning />,
		// },
	}

	const SWAP_WARNING = TOKEN_WARNINGS[swapCurrency.address]

	return (
		<Modal
			title={t('Notice for trading %symbol%', { symbol: SWAP_WARNING.symbol })}
			className={styles.modalContainer}
		>
			<div className="flex-align-start flex-justify-start">
				<div>{SWAP_WARNING.component}</div>
			</div>
			<Acknowledgement handleContinueClick={onDismiss} />
		</Modal>
	)
}

export default SwapWarningModal
