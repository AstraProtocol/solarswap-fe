import { Flex } from 'components/Layout/Flex'
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
			<Flex justifyContent="center" alignItems="center" height="100%" flexDirection="column">
				<span mb={['8px', '8px', '0px']}>{t('Failed to load price chart for this pair')}</span>
				<span
					textAlign={isMobile ? 'center' : 'left'}
					mb={['8px', '8px', '0px']}
					color="textSubtle"
					small
					style={isMobile && { wordSpacing: '100vw' }}
				>
					Token0: {token0Address ?? 'null'}
				</span>
				<span
					textAlign={isMobile ? 'center' : 'left'}
					mb={['8px', '8px', '0px']}
					color="textSubtle"
					small
					style={isMobile && { wordSpacing: '100vw' }}
				>
					Token1: {token1Address ?? 'null'}
				</span>
				<span
					textAlign={isMobile ? 'center' : 'left'}
					mb={['8px', '8px', '0px']}
					color="textSubtle"
					small
					style={isMobile && { wordSpacing: '100vw' }}
				>
					Pair: {pairAddress ?? 'null'}
				</span>
			</Flex>
		</>
	)
}

export default NoChartAvailable
