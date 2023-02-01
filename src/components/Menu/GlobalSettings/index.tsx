import { IconButton, IconEnum } from '@astraprotocol/astra-ui'
import { useModal } from 'components/Modal'
import SettingsModal from './SettingsModal'



const GlobalSettings = () => {
	const [onPresentSettingsModal] = useModal(<SettingsModal />)

	return (
		<div className="flex">
			<IconButton
				id="open-settings-dialog-button"
				size="lg"
				onClick={onPresentSettingsModal}
				icon={IconEnum.ICON_SETTING}
				classes="alert-color-error padding-right-xs"
			/>
		</div>
	)
}

export default GlobalSettings
