import { Icon, IconEnum } from '@astraprotocol/astra-ui'
import clsx from 'clsx'
import { useTranslation } from 'contexts/Localization'
import styles from './styles.module.scss'

export interface ExpandableSectionButtonProps {
	onClick?: () => void
	expanded?: boolean
}

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({ onClick, expanded = false }) => {
	const { t } = useTranslation()

	return (
		<div
			className={styles.wrapper}
			aria-label={t('Hide or show expandable content')}
			role="button"
			onClick={() => onClick()}
		>
			<span className="text text-base secondary-color-normal">{expanded ? t('Hide') : t('Details')}</span>
			<Icon
				icon={IconEnum.ICON_ARROW_DOWN}
				className={clsx(styles.iconArrow, { [styles.toggled]: expanded })}
				classes="secondary-color-normal"
			/>
		</div>
	)
}

export default ExpandableSectionButton
