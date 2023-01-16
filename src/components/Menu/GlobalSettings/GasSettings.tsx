import { NormalButton } from '@astraprotocol/astra-ui'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/user/hooks/helpers'
import { useGasPriceManager } from 'state/user/hooks'

const GasSettings = () => {
	const { t } = useTranslation()
	const [gasPrice, setGasPrice] = useGasPriceManager()

	return (
		<div className="flex col">
			<div className="flex flex-align-center margin-bottom-sm">
				<span className="text text-base text-bold">{t('Default Transaction Speed (TWEI)')}</span>
				<QuestionHelper
					text={t(
						'Adjusts the gas price (transaction fee) for your transaction. Higher TWEI = higher speed = higher fees'
					)}
					placement="top"
				/>
			</div>
			<div className="flex flex-wrap">
				<NormalButton
					onClick={() => {
						setGasPrice(GAS_PRICE_GWEI.default)
					}}
					classes={{ other: 'margin-top-xs' }}
					variant={gasPrice === GAS_PRICE_GWEI.default ? 'primary' : 'default'}
				>
					<span className="text text-sm">{t('Standard (%gasPrice%)', { gasPrice: Number(GAS_PRICE.default)/1000 })}</span>
				</NormalButton>
				<NormalButton
					onClick={() => {
						setGasPrice(GAS_PRICE_GWEI.fast)
					}}
					classes={{ other: 'margin-left-xs margin-top-xs' }}
					variant={gasPrice === GAS_PRICE_GWEI.fast ? 'primary' : 'default'}
				>
					<span className="text text-sm">{t('Fast (%gasPrice%)', { gasPrice: Number(GAS_PRICE.fast)/1000 })}</span>
				</NormalButton>
				<NormalButton
					onClick={() => {
						setGasPrice(GAS_PRICE_GWEI.instant)
					}}
					classes={{ other: 'margin-left-xs margin-top-xs' }}
					variant={gasPrice === GAS_PRICE_GWEI.instant ? 'primary' : 'default'}
				>
					<span className="text text-sm">{t('Instant (%gasPrice%)', { gasPrice: Number(GAS_PRICE.instant)/1000 })}</span>
				</NormalButton>
			</div>
		</div>
	)
}

export default GasSettings
