import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { CalculatorMode, RoiCalculatorReducerState } from './useRoiCalculatorReducer'
import styles from './styles.module.scss'
import { Form, IconButton, IconEnum } from '@astraprotocol/astra-ui'
import clsx from 'clsx'

const MILLION = 1000000
const TRILLION = 1000000000000

interface RoiCardProps {
	earningTokenSymbol: string
	calculatorState: RoiCalculatorReducerState
	setTargetRoi: (amount: string) => void
	setCalculatorMode: (mode: CalculatorMode) => void
}

const RoiCard: React.FC<RoiCardProps> = ({ earningTokenSymbol, calculatorState, setTargetRoi, setCalculatorMode }) => {
	const [expectedRoi, setExpectedRoi] = useState('')
	const inputRef = useRef<HTMLInputElement | null>(null)
	const { roiUSD, roiTokens, roiPercentage } = calculatorState.data
	const { mode } = calculatorState.controls

	const { t } = useTranslation()

	useEffect(() => {
		if (mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI && inputRef.current) {
			inputRef.current.focus()
		}
	}, [mode])

	const onEnterEditing = () => {
		setCalculatorMode(CalculatorMode.PRINCIPAL_BASED_ON_ROI)
		setExpectedRoi(
			roiUSD.toLocaleString('en', {
				minimumFractionDigits: roiUSD > MILLION ? 0 : 2,
				maximumFractionDigits: roiUSD > MILLION ? 0 : 2,
			}),
		)
	}

	const onExitRoiEditing = () => {
		setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
	}
	const handleExpectedRoiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.currentTarget.validity.valid) {
			const roiAsString = event.target.value.replace(/,/g, '.')
			setTargetRoi(roiAsString)
			setExpectedRoi(roiAsString)
		}
	}
	return (
		<div className={styles.roiCardWrapper}>
			<div className={styles.roiCardInner}>
				<span className="text text-uppercase text-bold text-xs contrast-color-70">
					{t('ROI at current rates')}
				</span>
				<div className="flex flex-justify-space-between margin-top-xs" style={{ height: 36 }}>
					{mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI ? (
						<>
							<div className={styles.roiInputContainer}>
								<Form.Input
									ref={inputRef}
									type="text"
									inputMode="decimal"
									pattern="^[0-9]+[.,]?[0-9]*$"
									// scale="sm"
									value={expectedRoi}
									placeholder="0.0"
									onChange={handleExpectedRoiChange}
								/>
							</div>
							<IconButton icon={IconEnum.ICON_CHECKED} onClick={onExitRoiEditing} />
						</>
					) : (
						<>
							<div className={styles.roiDisplayContainer} onClick={onEnterEditing}>
								{/* Dollar sign is separate cause its not supposed to scroll with a number if number is huge */}
								<span className="text text-xl text-bold">$</span>
								<span className={clsx(styles.roiDollarAmount, 'text text-xl text-bold')}>
									{roiUSD.toLocaleString('en', {
										minimumFractionDigits: roiUSD > MILLION ? 0 : 2,
										maximumFractionDigits: roiUSD > MILLION ? 0 : 2,
									})}
								</span>
							</div>
							<IconButton icon={IconEnum.ICON_EDIT} size="sm" onClick={onEnterEditing} />
						</>
					)}
				</div>
				<span className="text text-sm">
					~ {roiTokens} {earningTokenSymbol} (
					{roiPercentage.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
					%)
				</span>
			</div>
		</div>
	)
}

export default RoiCard
