import { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Checkbox, NormalButton } from '@astraprotocol/astra-ui'

interface AcknowledgementProps {
	handleContinueClick: () => void
}

const Acknowledgement: React.FC<AcknowledgementProps> = ({ handleContinueClick }) => {
	const { t } = useTranslation()
	const [isConfirmed, setIsConfirmed] = useState(false)

	return (
		<>
			<div className="flex flex-justify-space-between">
				<div className="flex flex-align-center">
					<Checkbox
						name="confirmed"
						type="checkbox"
						checked={isConfirmed}
						onChange={() => setIsConfirmed(!isConfirmed)}
						scale="sm"
					/>
					<span className="text text-base contrast-color-100" style={{ userSelect: 'none' }}>
						{t('I understand')}
					</span>
				</div>

				<NormalButton disabled={!isConfirmed} onClick={handleContinueClick}>
					{t('Continue')}
				</NormalButton>
			</div>
		</>
	)
}

export default Acknowledgement
