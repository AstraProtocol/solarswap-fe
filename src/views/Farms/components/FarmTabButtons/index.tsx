import { ButtonMenu, ButtonMenuItem } from '@astraprotocol/astra-ui'
import NotificationDot from 'components/NotificationDot'
import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'

interface FarmTabButtonsProps {
	hasStakeInFinishedFarms: boolean
}

const FarmTabButtons: React.FC<FarmTabButtonsProps> = ({ hasStakeInFinishedFarms }) => {
	const router = useRouter()
	const { t } = useTranslation()

	let activeIndex
	switch (router.pathname) {
		case '/farms':
			activeIndex = 0
			break
		case '/farms/history':
			activeIndex = 1
			break
		case '/farms/archived':
			activeIndex = 2
			break
		default:
			activeIndex = 0
			break
	}

	return (
		<div className={styles.wrapper}>
			<ButtonMenu activeIndex={activeIndex} size="xs">
				<ButtonMenuItem to="/farms">{t('Live')}</ButtonMenuItem>
				<NotificationDot show={hasStakeInFinishedFarms}>
					<ButtonMenuItem to="/farms/history" id="finished-farms-button">
						{t('Finished')}
					</ButtonMenuItem>
				</NotificationDot>
			</ButtonMenu>
		</div>
	)
}

export default FarmTabButtons
