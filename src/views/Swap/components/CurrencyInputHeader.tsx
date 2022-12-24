import TransactionsModal from 'components/App/Transactions/TransactionsModal'
// import GlobalSettings from 'components/Menu/GlobalSettings'
import { useExpertModeManager } from 'state/user/hooks'
// import RefreshIcon from 'components/Svg/RefreshIcon'
import { useModal } from 'components/Modal'
import NotificationDot from 'components/NotificationDot'
import { IconButton, IconEnum, Row } from '@astraprotocol/astra-ui'
import GlobalSettings from 'components/Menu/GlobalSettings'

interface Props {
	title: string
	subtitle: string
	noConfig?: boolean
	setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
	isChartDisplayed?: boolean
	hasAmount: boolean
	onRefreshPrice: () => void
}

// const CurrencyInputContainer = styled(Flex)`
// 	flex-direction: column;
// 	align-items: center;
// 	padding: 24px;
// 	width: 100%;
// 	border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
// `

// const ColoredIconButton = styled(IconButton)`
// 	color: ${({ theme }) => theme.colors.textSubtle};
// `

const CurrencyInputHeader: React.FC<Props> = ({
	title,
	subtitle,
	setIsChartDisplayed,
	isChartDisplayed,
	hasAmount,
	onRefreshPrice
}) => {
	const [expertMode] = useExpertModeManager()
	const toggleChartDisplayed = () => {
		setIsChartDisplayed(currentIsChartDisplayed => !currentIsChartDisplayed)
	}
	const [onPresentTransactionsModal] = useModal(<TransactionsModal />)

	return (
		<div className="flex col flex-align-center padding-md width-100 border border-bottom-base">
			<div className="flex width-100 flex-align-center flex-justify-space-between">
				{setIsChartDisplayed && isChartDisplayed ? (
					<IconButton size="lg" icon={IconEnum.ICON_CHART_BAR_OFF} onClick={toggleChartDisplayed} />
				) : (
					<IconButton size="lg" icon={IconEnum.ICON_CHART_BAR_ON} onClick={toggleChartDisplayed} />
				)}
				<div className="flex flex-align-end flex-justify-center width-100">
					<span className="text text-lg text-bold">{title}</span>
				</div>
				<Row>
					<NotificationDot show={expertMode}>
						<GlobalSettings color="textSubtle" mr="0" />
					</NotificationDot>
					<IconButton
						classes="padding-right-xs"
						size="lg"
						icon={IconEnum.ICON_RECENT}
						onClick={onPresentTransactionsModal}
					/>
					<IconButton size="lg" icon={IconEnum.ICON_RELOAD} onClick={() => onRefreshPrice()} />
				</Row>
			</div>
			<div className="flex flex-align-center">
				<span className="text text-sm contrast-color-70">{subtitle}</span>
			</div>
		</div>
	)
}

export default CurrencyInputHeader
