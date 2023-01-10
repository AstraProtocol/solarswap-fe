import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Link from 'next/link'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'
import { Icon, Row, IconButton, IconEnum } from '@astraprotocol/astra-ui'
import NotificationDot from 'components/NotificationDot'
import { useModal } from 'components/Modal'
import TransactionsModal from './Transactions/TransactionsModal'

interface Props {
	title: string
	subtitle: string
	helper?: string
	backTo?: string
	noConfig?: boolean
}

// const AppHeaderContainer = styled(Flex)`
//   align-items: center;
//   justify-content: space-between;
//   padding: 24px;
//   width: 100%;
//   border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
// `

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
	const [expertMode] = useExpertModeManager()
	const [onPresentTransactionsModal] = useModal(<TransactionsModal />)

	return (
		<div className="flex col flex-align-center padding-md width-100 border border-bottom-base">
			<div className="flex width-100 flex-align-center flex-justify-space-between position-relative">
				{backTo && (
					<div className="position-absolute">
						<Link passHref href={backTo}>
							<IconButton icon={IconEnum.ICON_BACK} />
						</Link>
					</div>
				)}
				<div className="flex flex-align-end flex-justify-center width-100">
					<span className="text text-lg text-bold">{title}</span>
				</div>
				{!noConfig && (
					<div className="position-absolute" style={{ right: 0 }}>
						<NotificationDot show={expertMode}>
							<GlobalSettings />
						</NotificationDot>
						<IconButton
							classes="padding-right-xs"
							size="lg"
							icon={IconEnum.ICON_RECENT}
							onClick={onPresentTransactionsModal}
						/>
					</div>
				)}
			</div>

			<div className="flex flex-align-center">
				{helper && <QuestionHelper className="margin-right-2xs" text={helper} mr="4px" placement="top-start" />}
				<span className="text text-sm contrast-color-70">{subtitle}</span>
			</div>
		</div>
	)
}

export default AppHeader
