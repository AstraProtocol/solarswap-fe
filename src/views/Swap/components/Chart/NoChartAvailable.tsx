import { useTranslation } from 'contexts/Localization'

interface NoChartAvailableProps {
	token0Address: string
	token1Address: string
	pairAddress: string
	isMobile: boolean
}

const NoChartAvailable: React.FC<NoChartAvailableProps> = ({ token0Address, token1Address, pairAddress, isMobile }) => {
	const { t } = useTranslation()
	return (
		<>
			<div className="flex flex-justify-center flex-align-center col height-100">
				<span className="text text-base">{t('Failed to load price chart for this pair')}</span>
				<span
					className="text text-sm contrast-color-70"
					style={{ textAlign: isMobile ? 'center' : 'left', wordSpacing: isMobile && '100vw' }}
				>
					Token0: {token0Address ?? 'null'}
				</span>
				<span
					className="text text-sm contrast-color-70"
					style={{ textAlign: isMobile ? 'center' : 'left', wordSpacing: isMobile && '100vw' }}
				>
					Token1: {token1Address ?? 'null'}
				</span>
				<span
					className="text text-sm contrast-color-70"
					style={{ textAlign: isMobile ? 'center' : 'left', wordSpacing: isMobile && '100vw' }}
				>
					Pair: {pairAddress ?? 'null'}
				</span>
			</div>
		</>
	)
}

export default NoChartAvailable
