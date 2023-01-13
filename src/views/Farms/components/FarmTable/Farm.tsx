import { useFarmUser } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import { Token } from '@solarswap/sdk'
import { getBalanceNumber } from 'utils/formatBalance'
import styles from './styles.module.scss'
import { TokenPairImage } from 'components/TokenImage'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'

export interface FarmProps {
	label: string
	pid: number
	token: Token
	quoteToken: Token
}

const Farm: React.FunctionComponent<FarmProps> = ({ token, quoteToken, label, pid }) => {
	const { isMobile } = useMatchBreakpoints()
	const { stakedBalance } = useFarmUser(pid)
	const { t } = useTranslation()
	const rawStakedBalance = getBalanceNumber(stakedBalance)

	const handleRenderFarming = (): JSX.Element => {
		if (rawStakedBalance) {
			return <div className="text text-sm text-bold text-uppercase contrast-color-70">{t('Farming')}</div>
		}

		return null
	}

	return (
		<div className={styles.farmContainer}>
			<div className={styles.farmTokenWrapper}>
				<TokenPairImage
					variant="inverted"
					primaryToken={token}
					secondaryToken={quoteToken}
					width={40}
					height={40}
				/>
			</div>
			<div className={isMobile ? 'margin-left-lg' : 'margin-left-xs'}>
				{handleRenderFarming()}
				<span className="text text-base text-bold">{label}</span>
			</div>
		</div>
	)
}

export default Farm
