import { Currency, Percent, Price } from '@solarswap/sdk'
import { NormalButton, Icon, Row } from '@astraprotocol/astra-ui'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from '../../components/Layout/Column'
import { ONE_BIPS } from '../../config/constants'
import { Field } from '../../state/mint/actions'

function PoolPriceBar({
	currencies,
	noLiquidity,
	poolTokenPercentage,
	price,
}: {
	currencies: { [field in Field]?: Currency }
	noLiquidity?: boolean
	poolTokenPercentage?: Percent
	price?: Price
}) {
	const { t } = useTranslation()
	return (
		<div className="flex col padding-md">
			<Row className="margin-2xs flex-justify-space-around" style={{ flexWrap: 'wrap' }}>
				<AutoColumn justify="center">
					<span className="text">{price?.toSignificant(6) ?? '-'}</span>
					<span className="text text-sm padding-top-sm">
						{t('%assetA% per %assetB%', {
							assetA: currencies[Field.CURRENCY_B]?.symbol ?? '',
							assetB: currencies[Field.CURRENCY_A]?.symbol ?? '',
						})}
					</span>
				</AutoColumn>
				<AutoColumn justify="center">
					<span className="text">{price?.invert()?.toSignificant(6) ?? '-'}</span>
					<span className="text text-sm padding-top-sm">
						{t('%assetA% per %assetB%', {
							assetA: currencies[Field.CURRENCY_A]?.symbol ?? '',
							assetB: currencies[Field.CURRENCY_B]?.symbol ?? '',
						})}
					</span>
				</AutoColumn>
				<AutoColumn justify="center">
					<span className="text">
						{noLiquidity && price
							? '100'
							: (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ??
							  '0'}
						%
					</span>
					<span className="text text-sm padding-top-sm">{t('Share of Pool')}</span>
				</AutoColumn>
			</Row>
		</div>
	)
}

export default PoolPriceBar
