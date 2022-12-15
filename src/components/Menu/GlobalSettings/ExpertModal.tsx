import { useState } from 'react'
import { useExpertModeManager } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { InjectedModalProps, Modal } from 'components/Modal'
import { Checkbox, Message, NormalButton } from '@astraprotocol/astra-ui'

interface ExpertModalProps extends InjectedModalProps {
	setShowConfirmExpertModal: (boolean) => void
	setShowExpertModeAcknowledgement: (boolean) => void
}

const ExpertModal: React.FC<ExpertModalProps> = ({ setShowConfirmExpertModal, setShowExpertModeAcknowledgement }) => {
	const [, toggleExpertMode] = useExpertModeManager()
	const [isRememberChecked, setIsRememberChecked] = useState(false)

	const { t } = useTranslation()

	return (
		<Modal
			title={t('Expert Mode')}
			onBack={() => setShowConfirmExpertModal(false)}
			onDismiss={() => setShowConfirmExpertModal(false)}
			headerBackground="gradients.cardHeader"
			style={{ maxWidth: '360px' }}
		>
			<Message variant="warning" mb="24px">
				<span className="text text-base">
					{t(
						"Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds."
					)}
				</span>
			</Message>
			<span className="text text-base" mb="24px">
				{t('Only use this mode if you know what you’re doing.')}
			</span>
			<div alignItems="center" mb="24px">
				<Checkbox
					name="confirmed"
					type="checkbox"
					checked={isRememberChecked}
					onChange={() => setIsRememberChecked(!isRememberChecked)}
					scale="sm"
				/>
				<span ml="10px" color="textSubtle" style={{ userSelect: 'none' }}>
					{t('Don’t show this again')}
				</span>
			</div>
			<NormalButton
				// mb="8px"
				id="confirm-expert-mode"
				onClick={() => {
					// eslint-disable-next-line no-alert
					if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
						toggleExpertMode()
						setShowConfirmExpertModal(false)
						if (isRememberChecked) {
							setShowExpertModeAcknowledgement(false)
						}
					}
				}}
			>
				{t('Turn On Expert Mode')}
			</NormalButton>
			<NormalButton
				// variant="secondary"
				onClick={() => {
					setShowConfirmExpertModal(false)
				}}
			>
				{t('Cancel')}
			</NormalButton>
		</Modal>
	)
}

export default ExpertModal
