import TransactionsModal from 'components/App/Transactions/TransactionsModal'
// import GlobalSettings from 'components/Menu/GlobalSettings'
import { useExpertModeManager } from 'state/user/hooks'
// import RefreshIcon from 'components/Svg/RefreshIcon'
import { useModal } from 'components/Modal'
import NotificationDot from 'components/NotificationDot'
import { IconButton } from '@astraprotocol/astra-ui'
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
		<div className="flex flex-align-center padding-lg width-100 border border-bottom-base">
			<div className="flex width-100 flex-align-center flex-justify-space-between">
				{setIsChartDisplayed && isChartDisplayed ? (
					<IconButton icon="chart-disabled-icon" onClick={toggleChartDisplayed} />
				) : (
					<IconButton icon="chart-icon" width="24px" />
				)}
				<div className="flex flex-align-end width-100">
					<span className="text text-base text-bold">{title}</span>
				</div>
				<div>
					<NotificationDot show={expertMode}>
						<GlobalSettings color="textSubtle" mr="0" />
					</NotificationDot>
					<IconButton onClick={onPresentTransactionsModal} variant="text" scale="sm" />
					{/* <HistoryIcon color="textSubtle" width="24px" /> */}
					{/* </IconButton> */}
					<IconButton variant="text" scale="sm" onClick={() => onRefreshPrice()} />
					{/* <RefreshIcon disabled={!hasAmount} color="textSubtle" width="27px" /> */}
					{/* </IconButton> */}
				</div>
			</div>
			<div className="flex flex-align-center">
				<span className="text text-sm">{subtitle}</span>
			</div>
		</div>
	)
}

export default CurrencyInputHeader
