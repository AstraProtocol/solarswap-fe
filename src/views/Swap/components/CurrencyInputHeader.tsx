import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import { useExpertModeManager } from 'state/user/hooks'
import { useModal } from 'components/Modal'
import NotificationDot from 'components/NotificationDot'
import { IconButton, IconEnum } from '@astraprotocol/astra-ui'
import GlobalSettings from 'components/Menu/GlobalSettings'
import RefreshIcon from 'components/Svg/RefreshIcon'
import { useTheme } from 'next-themes'

interface Props {
	title: string
	subtitle: string
	noConfig?: boolean
	setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
	isChartDisplayed?: boolean
	hasAmount: boolean
	onRefreshPrice: () => void
}

const CurrencyInputHeader: React.FC<Props> = ({
	title,
	subtitle,
	setIsChartDisplayed,
	isChartDisplayed,
	hasAmount,
	onRefreshPrice,
}) => {
	const { resolvedTheme } = useTheme()
	const [expertMode] = useExpertModeManager()
	const toggleChartDisplayed = () => {
		setIsChartDisplayed(currentIsChartDisplayed => !currentIsChartDisplayed)
	}
	const [onPresentTransactionsModal] = useModal(<TransactionsModal />)

	return (
		<div className="flex col flex-align-center padding-md width-100 border border-bottom-base">
			<div className="flex width-100 flex-align-center flex-justify-space-between position-relative">
				<div className="position-absolute">
					{setIsChartDisplayed && isChartDisplayed ? (
						<IconButton size="lg" icon={IconEnum.ICON_CHART_BAR_OFF} onClick={toggleChartDisplayed} />
					) : (
						<IconButton size="lg" icon={IconEnum.ICON_CHART_BAR_ON} onClick={toggleChartDisplayed} />
					)}
				</div>
				<div className="flex flex-align-end flex-justify-center width-100">
					<span className="text text-lg text-bold">{title}</span>
				</div>
				<div className="row position-absolute" style={{ right: 0 }}>
					<NotificationDot show={expertMode}>
						<GlobalSettings />
					</NotificationDot>
					<IconButton
						classes="padding-right-xs"
						size="lg"
						icon={IconEnum.ICON_RECENT}
						onClick={onPresentTransactionsModal}
					/>
					<a className="link" onClick={() => onRefreshPrice()}>
						<RefreshIcon
							disabled={!hasAmount}
							color={resolvedTheme === 'dark' ? 'white' : 'black'}
							width="23px"
						/>
					</a>
				</div>
			</div>
			<div className="flex flex-align-center">
				<span className="text text-sm contrast-color-70">{subtitle}</span>
			</div>
		</div>
	)
}

export default CurrencyInputHeader
