import { ButtonMenu, ButtonMenuItem } from '@astraprotocol/astra-ui'
import NotificationDot from 'components/NotificationDot'
import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
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

	const onGo = (routeIndex: number) => {
		switch (routeIndex) {
			case 1:
				router.push('/farms/history')
				break
			case 2:
				router.push('/farms/archived')
				break
			case 0:
			default:
				router.push('/farms')
				break
		}
	}

	return (
		<div className={styles.wrapper}>
			<ButtonMenu onItemClick={onGo} activeIndex={activeIndex} size="xs">
				<ButtonMenuItem>{t('Live')}</ButtonMenuItem>
				<NotificationDot show={hasStakeInFinishedFarms}>
					<ButtonMenuItem id="finished-farms-button">{t('Finished')}</ButtonMenuItem>
				</NotificationDot>
			</ButtonMenu>
		</div>
	)
}

export default FarmTabButtons
