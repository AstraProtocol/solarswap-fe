import { useState } from 'react'
import {
	useAudioModeManager,
	useExpertModeManager,
	useSubgraphHealthIndicatorManager,
	useUserExpertModeAcknowledgementShow,
	useUserSingleHopOnly
} from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { useSwapActionHandlers } from 'state/swap/hooks'
import QuestionHelper from '../../QuestionHelper'
import TransactionSettings from './TransactionSettings'
import ExpertModal from './ExpertModal'
import GasSettings from './GasSettings'
import { InjectedModalProps, Modal } from 'components/Modal'
import { Toggle } from '@astraprotocol/astra-ui'

// const ScrollableContainer = styled(div)`
//   flex-direction: column;
//   max-height: 400px;
//   ${({ theme }) => theme.mediaQueries.sm} {
//     max-height: none;
//   }
// `

const SettingsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
	const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
	const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
	const [expertMode, toggleExpertMode] = useExpertModeManager()
	const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
	const [audioPlay, toggleSetAudioMode] = useAudioModeManager()
	const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
	const { onChangeRecipient } = useSwapActionHandlers()

	const { t } = useTranslation()
	// const { theme, isDark, setTheme } = useTheme()

	if (showConfirmExpertModal) {
		return (
			<ExpertModal
				setShowConfirmExpertModal={setShowConfirmExpertModal}
				onDismiss={onDismiss}
				setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
			/>
		)
	}

	const handleExpertModeToggle = () => {
		if (expertMode) {
			onChangeRecipient(null)
			toggleExpertMode()
		} else if (!showExpertModeAcknowledgement) {
			onChangeRecipient(null)
			toggleExpertMode()
		} else {
			setShowConfirmExpertModal(true)
		}
	}

	return (
		<Modal
			title={t('Settings')}
			headerBackground="gradients.cardHeader"
			onDismiss={onDismiss}
			style={{ maxWidth: '420px' }}
		>
			<div style={{ maxHeight: 400 }}>
				<div pb="24px" flexDirection="column">
					<span bold textTransform="uppercase" fontSize="12px" color="secondary" mb="24px">
						{t('Global')}
					</span>
					<div justifyContent="space-between">
						<span mb="24px">{t('Dark mode')}</span>
						{/* <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} /> */}
					</div>
					<GasSettings />
				</div>
				<div pt="24px" flexDirection="column">
					<span bold textTransform="uppercase" fontSize="12px" color="secondary" mb="24px">
						{t('Swaps & Liquidity')}
					</span>
					<TransactionSettings />
				</div>
				<div justifyContent="space-between" alignItems="center" mb="24px">
					<div alignItems="center">
						<span>{t('Expert Mode')}</span>
						<QuestionHelper
							text={t(
								'Bypasses confirmation modals and allows high slippage trades. Use at your own risk.'
							)}
							placement="top-start"
							ml="4px"
						/>
					</div>
					<Toggle
						id="toggle-expert-mode-button"
						scale="md"
						checked={expertMode}
						onChange={handleExpertModeToggle}
					/>
				</div>
				<div justifyContent="space-between" alignItems="center" mb="24px">
					<div alignItems="center">
						<span>{t('Disable Multihops')}</span>
						<QuestionHelper
							text={t('Restricts swaps to direct pairs only.')}
							placement="top-start"
							ml="4px"
						/>
					</div>
					<Toggle
						id="toggle-disable-multihop-button"
						checked={singleHopOnly}
						scale="md"
						onChange={() => {
							setSingleHopOnly(!singleHopOnly)
						}}
					/>
				</div>
				<div justifyContent="space-between" alignItems="center" mb="24px">
					<div alignItems="center">
						<span>{t('Subgraph Health Indicator')}</span>
						<QuestionHelper
							text={t(
								'Turn on NFT market subgraph health indicator all the time. Default is to show the indicator only when the network is delayed'
							)}
							placement="top-start"
							ml="4px"
						/>
					</div>
					<Toggle
						id="toggle-subgraph-health-button"
						checked={subgraphHealth}
						scale="md"
						onChange={() => {
							setSubgraphHealth(!subgraphHealth)
						}}
					/>
				</div>
				<div justifyContent="space-between" alignItems="center">
					<div alignItems="center">
						<span>{t('Flippy sounds')}</span>
						<QuestionHelper
							text={t('Fun sounds to make a truly immersive solar-flipping trading experience')}
							placement="top-start"
							ml="4px"
						/>
					</div>
					{/* <SolarToggle checked={audioPlay} onChange={toggleSetAudioMode} scale="md" /> */}
				</div>
			</div>
		</Modal>
	)
}

export default SettingsModal
