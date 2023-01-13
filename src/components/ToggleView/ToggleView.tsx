import { IconButton, IconEnum } from '@astraprotocol/astra-ui'
import { ViewMode } from 'state/user/actions'
import styles from './styles.module.scss'

interface ToggleViewProps {
	idPrefix: string
	viewMode: ViewMode
	onToggle: (mode: ViewMode) => void
}

const ToggleView: React.FunctionComponent<ToggleViewProps> = ({ idPrefix, viewMode, onToggle }) => {
	const handleToggle = (mode: ViewMode) => {
		if (viewMode !== mode) {
			onToggle(mode)
		}
	}

	return (
		<div className={styles.container}>
			<IconButton
				icon={IconEnum.ICON_GRID}
				size="lg"
				// id={`${idPrefix}CardView`}
				onClick={() => handleToggle(ViewMode.CARD)}
				color={viewMode === ViewMode.CARD && '#6535e9'}
				classes={'margin-right-xs'}
			/>
			<IconButton
				icon={IconEnum.ICON_LIST}
				size="lg"
				// id={`${idPrefix}TableView`}
				onClick={() => handleToggle(ViewMode.TABLE)}
				color={viewMode === ViewMode.TABLE && '#6535e9'}
				classes={'margin-right-xs'}
			/>
		</div>
	)
}

export default ToggleView
