import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/user/hooks/helpers'
import { useGasPriceManager } from 'state/user/hooks'
import { NormalButton } from '@astraprotocol/astra-ui'

const GasSettings = () => {
	const { t } = useTranslation()
	const [gasPrice, setGasPrice] = useGasPriceManager()

	return (
		<div className="flex col">
			<div className="flex flex-align-center">
				<span className="text text-base">{t('Default Transaction Speed (GWEI)')}</span>
				<QuestionHelper
					text={t(
						'Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees'
					)}
					placement="top-start"
					ml="4px"
				/>
			</div>
			<div className="flex flex-wrap">
				<NormalButton
					onClick={() => {
						setGasPrice(GAS_PRICE_GWEI.default)
					}}
					// variant={gasPrice === GAS_PRICE_GWEI.default ? 'primary' : 'tertiary'}
				>
					{t('Standard (%gasPrice%)', { gasPrice: GAS_PRICE.default })}
				</NormalButton>
				<NormalButton
					onClick={() => {
						setGasPrice(GAS_PRICE_GWEI.fast)
					}}
					// variant={gasPrice === GAS_PRICE_GWEI.fast ? 'primary' : 'tertiary'}
				>
					{t('Fast (%gasPrice%)', { gasPrice: GAS_PRICE.fast })}
				</NormalButton>
				<NormalButton
					onClick={() => {
						setGasPrice(GAS_PRICE_GWEI.instant)
					}}
					// variant={gasPrice === GAS_PRICE_GWEI.instant ? 'primary' : 'tertiary'}
				>
					{t('Instant (%gasPrice%)', { gasPrice: GAS_PRICE.instant })}
				</NormalButton>
			</div>
		</div>
	)
}

export default GasSettings
