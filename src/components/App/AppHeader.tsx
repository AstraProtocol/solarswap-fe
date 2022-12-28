import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Link from 'next/link'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'
import { Icon, IconButton, IconEnum } from '@astraprotocol/astra-ui'

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

	return (
		<div className="flex flex-align-center flex-justify-space-between padding-md width-100 border border-base">
			<div className="flex flex-align-center">
				{backTo && (
					<Link passHref href={backTo}>
						<Icon icon={IconEnum.ICON_BACK} />
					</Link>
				)}
				<div>
					<span as="h2" mb="8px">
						{title}
					</span>
					<div className="flex flex-align-center">
						{helper && <QuestionHelper text={helper} mr="4px" placement="top-start" />}
						<Text color="textSubtle" fontSize="14px">
							{subtitle}
						</Text>
					</div>
				</div>
			</div>
			{!noConfig && (
				<div className="flex flex-align-center">
					<NotificationDot show={expertMode}>
						<GlobalSettings />
					</NotificationDot>
					<Transactions />
				</div>
			)}
		</div>
	)
}

export default AppHeader
