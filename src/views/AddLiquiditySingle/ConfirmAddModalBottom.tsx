import { Currency, CurrencyAmount, Fraction, Percent } from '@solarswap/sdk'
import { NormalButton, Icon, Row } from '@astraprotocol/astra-ui'
import { useTranslation } from 'contexts/Localization'
import { CurrencyLogo } from '../../components/Logo'
import { Field } from '../../state/mint/actions'

function ConfirmAddModalBottom({
	noLiquidity,
	price,
	currencies,
	parsedAmounts,
	poolTokenPercentage,
	onAdd,
}: {
	noLiquidity?: boolean
	price?: Fraction
	currencies: { [field in Field]?: Currency }
	parsedAmounts: { [field in Field]?: CurrencyAmount }
	poolTokenPercentage?: Percent
	onAdd: () => void
}) {
	const { t } = useTranslation()
	return (
		<>
			<div className="margin-top-lg padding-md border border-base radius-lg margin-bottom-md same-bg-color-50">
				{parsedAmounts[Field.CURRENCY_A] && (
					<Row className="flex-justify-space-between flex-align-center">
						<span className="text text-sm">
							{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_A]?.symbol })}
						</span>
						<div className="flex">
							<CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
							<span
								className="text text-sm"
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									display: 'flex',
									textAlign: 'right',
									paddingLeft: '5px',
								}}
							>
								{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
							</span>
						</div>
					</Row>
				)}
				{parsedAmounts[Field.CURRENCY_B] && (
					<Row className="flex-justify-space-between flex-align-center">
						<span className="text text-sm">
							{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_B]?.symbol })}
						</span>
						<div className="flex">
							<CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
							<span
								className="text text-sm"
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									display: 'flex',
									textAlign: 'right',
									paddingLeft: '5px',
								}}
							>
								{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
							</span>
						</div>
					</Row>
				)}

				<Row className="flex-justify-space-between">
					<span className="text text-sm">{t('Rates')}</span>
					<span className="text text-sm">
						{`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
							currencies[Field.CURRENCY_B]?.symbol
						}`}
					</span>
				</Row>
				<Row className="flex-justify-space-between" style={{ justifyContent: 'flex-end' }}>
					<span className="text text-sm">
						{`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
							currencies[Field.CURRENCY_A]?.symbol
						}`}
					</span>
				</Row>
				<Row className="flex-justify-space-between">
					<span className="text text-sm">{t('Share of Pool')}:</span>
					<span className="text text-sm">{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</span>
				</Row>
			</div>
			<Row>
				<NormalButton classes={{ other: 'text text-base width-100 margin-top-lg' }} onClick={onAdd}>
					{noLiquidity ? t('Create Pool & Supply') : t('Confirm Supply')}
				</NormalButton>
			</Row>
		</>
	)
}

export default ConfirmAddModalBottom
