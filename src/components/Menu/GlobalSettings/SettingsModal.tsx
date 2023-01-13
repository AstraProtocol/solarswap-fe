import { useState } from 'react'
import {
	// useAudioModeManager,
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
import ThemeSwitcher from 'components/ThemeSwitcher'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'

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
	// const [audioPlay, toggleSetAudioMode] = useAudioModeManager()
	const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
	const { onChangeRecipient } = useSwapActionHandlers()
	const { isMobile } = useMatchBreakpoints()

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
		<Modal title={t('Settings')} onDismiss={onDismiss} style={{ width: 380, maxWidth: 420, maxHeight: '100vh' }}>
			<div style={{ height: isMobile ? 400 : 600 }}>
				<div className="flex col border border-bottom-base padding-bottom-md">
					<span className="text text-lg text-bold text-uppercase secondary-color-normal">{t('Global')}</span>
					<div className="flex flex-justify-space-between flex-align-center margin-bottom-sm">
						<span className="text text-base text-bold">{t('Dark mode')}</span>
						<ThemeSwitcher />
					</div>
					<GasSettings />
				</div>
				<div className="flex col border-bottom-base padding-bottom-md">
					<span className="text text-lg text-bold text-uppercase secondary-color-normal margin-top-md margin-bottom-md">
						{t('Swaps & Liquidity')}
					</span>
					<TransactionSettings />
				</div>
				<div className="flex flex-justify-space-between flex-align-center border-bottom-base padding-bottom-md">
					<div className="flex flex-align-center">
						<span className="text text-base text-bold margin-right-xs">{t('Expert Mode')}</span>
						<QuestionHelper
							text={t(
								'Bypasses confirmation modals and allows high slippage trades. Use at your own risk.'
							)}
							placement="top"
						/>
					</div>
					<Toggle
						id="toggle-expert-mode-button"
						scale="md"
						checked={expertMode}
						onChange={handleExpertModeToggle}
					/>
				</div>
				<div className="flex flex-justify-space-between flex-align-center border-bottom-base padding-bottom-md">
					<div className="flex flex-align-center">
						<span className="text text-base text-bold margin-right-xs">{t('Disable Multihops')}</span>
						<QuestionHelper text={t('Restricts swaps to direct pairs only.')} placement="top" />
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
				<div className="flex flex-justify-space-between flex-align-center border-bottom-base padding-bottom-md">
					<div className="flex flex-align-center">
						<span className="text text-base text-bold margin-right-xs">
							{t('Subgraph Health Indicator')}
						</span>
						<QuestionHelper
							text={t(
								'Turn on NFT market subgraph health indicator all the time. Default is to show the indicator only when the network is delayed'
							)}
							placement="top"
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
				{/* <div className="flex flex-justify-space-between flex-align-center">
					<div className="flex flex-align-center">
						<span>{t('Flippy sounds')}</span>
						<QuestionHelper
							text={t('Fun sounds to make a truly immersive solar-flipping trading experience')}
							placement="top-start"
							ml="4px"
						/>
					</div>
					<SolarToggle checked={audioPlay} onChange={toggleSetAudioMode} scale="md" />
				</div> */}
			</div>
		</Modal>
	)
}

export default SettingsModal
