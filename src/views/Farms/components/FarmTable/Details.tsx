import { Icon, IconEnum } from '@astraprotocol/astra-ui'
import clsx from 'clsx'
import { useTranslation } from 'contexts/Localization'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import styles from './styles.module.scss'

interface DetailsProps {
	actionPanelToggled: boolean
}

const Details: React.FC<DetailsProps> = ({ actionPanelToggled }) => {
	const { t } = useTranslation()
	const { isDesktop } = useMatchBreakpoints()

	return (
		<div className={styles.detailContainer}>
			{!isDesktop && <span className="text text-base secondary-color-normal">{t('Details')}</span>}
			<Icon
				icon={IconEnum.ICON_ARROW_DOWN}
				className={clsx(styles.iconArrow, { [styles.toggled]: actionPanelToggled })}
				classes="secondary-color-normal"
			/>
		</div>
	)
}

export default Details
