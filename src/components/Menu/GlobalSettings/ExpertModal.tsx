import { useState } from 'react'
import { useExpertModeManager } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { InjectedModalProps, Modal } from 'components/Modal'
import { Checkbox, Message, NormalButton, Row } from '@astraprotocol/astra-ui'

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
			style={{ maxWidth: '360px' }}
		>
			<Message variant="warning">
				<span className="text text-base">
					{t(
						"Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds.",
					)}
				</span>
			</Message>
			<span className="text text-base margin-top-md">
				{t('Only use this mode if you know what you’re doing.')}
			</span>
			<Row className="margin-top-md margin-bottom-md flex-align-center">
				<Checkbox
					name="confirmed"
					type="checkbox"
					checked={isRememberChecked}
					onChange={() => setIsRememberChecked(!isRememberChecked)}
					scale="sm"
				/>
				<span className="text text-base margin-left-sm" style={{ userSelect: 'none' }}>
					{t('Don’t show this again')}
				</span>
			</Row>
			<NormalButton
				id="confirm-expert-mode"
				onClick={() => {
					if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
						toggleExpertMode()
						setShowConfirmExpertModal(false)
						if (isRememberChecked) {
							setShowExpertModeAcknowledgement(false)
						}
					}
				}}
				classes={{ other: 'margin-bottom-sm' }}
			>
				<span className="text text-base text-bold"> {t('Turn On Expert Mode')}</span>
			</NormalButton>
			<NormalButton
				variant="default"
				onClick={() => {
					setShowConfirmExpertModal(false)
				}}
			>
				<span className="text text-base text-bold">{t('Cancel')}</span>
			</NormalButton>
		</Modal>
	)
}

export default ExpertModal
