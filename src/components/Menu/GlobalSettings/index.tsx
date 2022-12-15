import { IconButton } from '@astraprotocol/astra-ui'
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
				icon=""
				// variant="text"
				// scale="sm"
				// mr={mr}
				// id="open-settings-dialog-button"
				// <CogIcon height={24} width={24} color={color || 'textSubtle'} />
			/>
		</div>
	)
}

export default GlobalSettings
