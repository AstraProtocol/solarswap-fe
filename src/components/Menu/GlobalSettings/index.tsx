import { IconButton, IconEnum } from '@astraprotocol/astra-ui'
import { useModal } from 'components/Modal'
import SettingsModal from './SettingsModal'

type Props = {
	color?: string
	mr?: string
}

const GlobalSettings = ({ color, mr = '8px' }: Props) => {
	const [onPresentSettingsModal] = useModal(<SettingsModal />)

	return (
		<div className="flex">
			<IconButton
				onClick={onPresentSettingsModal}
				icon={IconEnum.ICON_SETTING}
				classes="text-2xl alert-color-error"
			/>
		</div>
	)
}

export default GlobalSettings
